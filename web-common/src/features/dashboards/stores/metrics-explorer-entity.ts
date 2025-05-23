import type { MeasureFilterEntry } from "@rilldata/web-common/features/dashboards/filters/measure-filters/measure-filter-entry";
import {
  LeaderboardContextColumn,
  type ContextColWidths,
} from "@rilldata/web-common/features/dashboards/leaderboard-context-column";
import type { PivotState } from "@rilldata/web-common/features/dashboards/pivot/types";
import type {
  SortDirection,
  SortType,
} from "@rilldata/web-common/features/dashboards/proto-state/derived-types";
import { type TDDState } from "@rilldata/web-common/features/dashboards/time-dimension-details/types";
import type {
  DashboardTimeControls,
  ScrubRange,
} from "@rilldata/web-common/lib/time/types";
import type { DashboardState_ActivePage } from "@rilldata/web-common/proto/gen/rill/ui/v1/dashboard_pb";
import type { V1Expression } from "@rilldata/web-common/runtime-client";

export interface DimensionThresholdFilter {
  name: string;
  filters: MeasureFilterEntry[];
}

export interface MetricsExplorerEntity {
  name: string;

  /**
   * This array controls which measures are visible in
   * explorer on the client. Note that this will need to be
   * updated to include all measure keys upon initialization
   * or else all measure will be hidden
   */
  visibleMeasures: string[];

  /**
   * While the `visibleMeasureKeys` has the list of visible measures,
   * this is explicitly needed to fill the state.
   * TODO: clean this up when we refactor how url state is synced
   */
  allMeasuresVisible: boolean;

  /**
   * This array controls which dimensions are visible in
   * explorer on the client.Note that if this is null, all
   * dimensions will be visible (this is needed to default to all visible
   * when there are not existing keys in the URL or saved on the
   * server)
   */
  visibleDimensions: string[];

  /**
   * While the `visibleDimensionKeys` has the list of all visible dimensions,
   * this is explicitly needed to fill the state.
   * TODO: clean this up when we refactor how url state is synced
   */
  allDimensionsVisible: boolean;

  // Question: is this still used by the dimension table?
  /**
   * This is the name of the currently-sorted measure in the leaderboards.
   * Leaderboards can have one or more measures, so we need to know which one is currently sorted.
   */
  leaderboardSortByMeasureName: string;

  /**
   * This is the list of measure names to show in the leaderboard.
   */
  leaderboardMeasureNames: string[];

  /**
   * Whether to show context for all measures in the leaderboard.
   */
  leaderboardShowContextForAllMeasures: boolean;

  /**
   * This is the sort type that will be used for the leaderboard
   * and dimension detail table. See SortType for more details.
   */
  dashboardSortType: SortType;

  /**
   * This is the sort direction that will be used for the leaderboard
   * and dimension detail table.
   */
  sortDirection: SortDirection;

  whereFilter: V1Expression;
  dimensionsWithInlistFilter: string[];
  dimensionThresholdFilters: Array<DimensionThresholdFilter>;

  /**
   * stores whether a dimension is in include/exclude filter mode
   * false/absence = include, true = exclude
   */
  dimensionFilterExcludeMode: Map<string, boolean>;

  /**
   * Used to add a dropdown for newly added dimension/measure filters.
   * Such filter will not have an entry in where/having expression objects.
   */
  temporaryFilterName: string | null;

  /**
   * user selected time range
   */
  selectedTimeRange?: DashboardTimeControls;

  /**
   * user selected scrub range
   */
  selectedScrubRange?: ScrubRange;
  lastDefinedScrubRange?: ScrubRange;

  selectedComparisonTimeRange?: DashboardTimeControls;
  selectedComparisonDimension?: string;

  /**
   * Explicit active page setting.
   * This avoids using presence of value in `selectedDimensionName` or `expandedMeasureName`.
   */
  activePage: DashboardState_ActivePage;

  /**
   * user selected timezone, should default to "UTC" if no other value is set
   */
  selectedTimezone: string;

  /**
   * flag to show/hide time comparison based on user preference.
   * This controls whether a time comparison is shown in e.g.
   * the line charts and bignums.
   * It does NOT affect the leaderboard context column.
   */
  showTimeComparison: boolean;

  /**
   * state of context column in the leaderboard
   */
  // @deprecated
  leaderboardContextColumn: LeaderboardContextColumn;

  /**
   * Width of each context column. Needs to be reset to default
   * when changing context column or switching between leaderboard
   * and dimension detail table
   */
  contextColumnWidths: ContextColWidths;

  /**
   * The name of the dimension that is currently shown in the dimension
   * detail table. If this is undefined, then the dimension detail table
   * is not shown.
   */
  selectedDimensionName?: string;

  /**
   * Consolidated state for Time Dimenstion Detail view
   */
  tdd: TDDState;

  pivot: PivotState;

  proto?: string;
}
