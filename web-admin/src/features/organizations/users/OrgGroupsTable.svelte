<script lang="ts">
  import type {
    V1OrganizationMemberUser,
    V1MemberUsergroup,
  } from "@rilldata/web-admin/client";
  import { flexRender } from "@tanstack/svelte-table";
  import type { ColumnDef } from "@tanstack/svelte-table";
  import OrgGroupsTableActionsCell from "./OrgGroupsTableActionsCell.svelte";
  import OrgGroupsTableRoleCell from "./OrgGroupsTableRoleCell.svelte";
  import BasicTable from "@rilldata/web-common/components/table/BasicTable.svelte";

  export let data: V1MemberUsergroup[];
  export let currentUserEmail: string;
  export let searchUsersList: V1OrganizationMemberUser[];

  const columns: ColumnDef<V1MemberUsergroup, any>[] = [
    {
      accessorKey: "groupName",
      header: "Group",
      meta: {
        widthPercent: 50,
      },
    },
    {
      accessorKey: "roleName",
      header: "Role",
      cell: ({ row }) =>
        flexRender(OrgGroupsTableRoleCell, {
          name: row.original.groupName,
          managed: row.original.groupManaged,
          role: row.original.roleName,
        }),
      meta: {
        widthPercent: 40,
        marginLeft: "8px",
      },
    },
    {
      accessorKey: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) =>
        flexRender(OrgGroupsTableActionsCell, {
          name: row.original.groupName,
          managed: row.original.groupManaged,
          currentUserEmail: currentUserEmail,
          searchUsersList: searchUsersList,
        }),
      meta: {
        widthPercent: 5,
      },
    },
  ];
</script>

<BasicTable {data} {columns} emptyText="No groups found" />
