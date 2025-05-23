package duckdb

import (
	"context"
	"errors"
	"fmt"
	"io"
	"time"

	"github.com/mitchellh/mapstructure"
	"github.com/rilldata/rill/runtime/drivers"
	"github.com/rilldata/rill/runtime/pkg/fileutil"
	"github.com/rilldata/rill/runtime/pkg/observability"
	"go.uber.org/zap"
)

type warehouseToSelfExecutor struct {
	c *connection
	w drivers.Warehouse
}

var _ drivers.ModelExecutor = &warehouseToSelfExecutor{}

func (e *warehouseToSelfExecutor) Concurrency(desired int) (int, bool) {
	if desired > 1 {
		return 0, false
	}
	return 1, true
}

func (e *warehouseToSelfExecutor) Execute(ctx context.Context, opts *drivers.ModelExecuteOptions) (*drivers.ModelResult, error) {
	outputProps := &ModelOutputProperties{}
	if err := mapstructure.WeakDecode(opts.OutputProperties, outputProps); err != nil {
		return nil, fmt.Errorf("failed to parse output properties: %w", err)
	}
	if err := outputProps.Validate(opts); err != nil {
		return nil, fmt.Errorf("invalid output properties: %w", err)
	}

	usedModelName := false
	if outputProps.Table == "" {
		outputProps.Table = opts.ModelName
		usedModelName = true
	}

	tableName := outputProps.Table
	stagingTableName := tableName
	if !opts.IncrementalRun {
		if opts.Env.StageChanges {
			stagingTableName = stagingTableNameFor(tableName)
		}

		// NOTE: This intentionally drops the end table if not staging changes.
		_ = e.c.dropTable(ctx, stagingTableName)
	}

	err := e.queryAndInsert(ctx, opts, stagingTableName, outputProps)
	if err != nil {
		if !opts.IncrementalRun {
			_ = e.c.dropTable(ctx, stagingTableName)
		}
		return nil, err
	}

	if !opts.IncrementalRun {
		if stagingTableName != tableName {
			err = e.c.forceRenameTable(ctx, stagingTableName, false, tableName)
			if err != nil {
				return nil, fmt.Errorf("failed to rename staged model: %w", err)
			}
		}
	}

	resultProps := &ModelResultProperties{
		Table:         tableName,
		UsedModelName: usedModelName,
	}
	resultPropsMap := map[string]interface{}{}
	err = mapstructure.WeakDecode(resultProps, &resultPropsMap)
	if err != nil {
		return nil, fmt.Errorf("failed to encode result properties: %w", err)
	}

	// Done
	return &drivers.ModelResult{
		Connector:  opts.OutputConnector,
		Properties: resultPropsMap,
		Table:      tableName,
	}, nil
}

func (e *warehouseToSelfExecutor) queryAndInsert(ctx context.Context, opts *drivers.ModelExecuteOptions, outputTable string, outputProps *ModelOutputProperties) (err error) {
	start := time.Now()
	e.c.logger.Debug("duckdb: warehouse transfer started", zap.String("model", opts.ModelName), observability.ZapCtx(ctx))
	defer func() {
		e.c.logger.Debug("duckdb: warehouse transfer finished", zap.Duration("elapsed", time.Since(start)), zap.Bool("success", err == nil), zap.Error(err), observability.ZapCtx(ctx))
	}()

	iter, err := e.w.QueryAsFiles(ctx, opts.InputProperties)
	if err != nil {
		return err
	}
	defer iter.Close()

	create := !opts.IncrementalRun
	var execDuration time.Duration
	for {
		files, err := iter.Next()
		if err != nil {
			if errors.Is(err, io.EOF) || errors.Is(err, drivers.ErrNoRows) {
				break
			}
			return err
		}

		format := fileutil.FullExt(files[0])
		if iter.Format() != "" {
			format += "." + iter.Format()
		}

		from, err := sourceReader(files, format, make(map[string]any))
		if err != nil {
			return err
		}
		qry := fmt.Sprintf("SELECT * FROM %s", from)

		if !create && opts.IncrementalRun {
			insertOpts := &InsertTableOptions{
				ByName:    false,
				Strategy:  outputProps.IncrementalStrategy,
				UniqueKey: outputProps.UniqueKey,
			}
			metrics, err := e.c.insertTableAsSelect(ctx, outputTable, qry, insertOpts)
			if err != nil {
				return fmt.Errorf("failed to incrementally insert into table: %w", err)
			}
			execDuration += metrics.duration
			continue
		}

		if !create {
			insertOpts := &InsertTableOptions{
				ByName:   false,
				Strategy: drivers.IncrementalStrategyAppend,
			}
			metrics, err := e.c.insertTableAsSelect(ctx, outputTable, qry, insertOpts)
			if err != nil {
				return fmt.Errorf("failed to insert into table: %w", err)
			}
			execDuration += metrics.duration
			continue
		}

		metrics, err := e.c.createTableAsSelect(ctx, outputTable, qry, &createTableOptions{})
		if err != nil {
			return fmt.Errorf("failed to create table: %w", err)
		}
		execDuration += metrics.duration

		create = false
	}

	// We were supposed to create the table, but didn't get any data
	if create {
		return drivers.ErrNoRows
	}

	return nil
}
