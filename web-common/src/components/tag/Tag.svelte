<script context="module" lang="ts">
  export type Color =
    | "gray"
    | "magenta"
    | "green"
    | "red"
    | "dark orange"
    | "orange"
    | "amber"
    | "blue"
    | "purple";
</script>

<script lang="ts">
  export let color: Color = "gray";
  export let height = 21;
  export let text: string = "";

  let className: string | undefined = undefined;

  export { className as class };

  function getColorClass(color: string) {
    switch (color) {
      case "gray":
        return "bg-gray-100 border-gray-300 text-gray-600";
      case "magenta":
        return "bg-pink-50 border-pink-300 text-pink-700";
      case "green":
        return "bg-green-50 border-green-300 text-green-600";
      case "red":
        return "bg-red-50 border-red-300 text-red-600";
      case "dark orange":
        return "bg-orange-50 border-orange-300 text-orange-800";
      case "orange":
        return "bg-orange-50 border-orange-300 text-orange-600";
      case "amber":
        return "bg-amber-50 border-amber-300 text-amber-600";
      case "blue":
        return "bg-primary-50 border-primary-300 text-primary-600";
      case "purple":
        return "bg-purple-50 border-purple-300 text-purple-600";
      default:
        return "bg-gray-100 border-gray-300 text-gray-600";
    }
  }
</script>

<div
  style:height="{height}px"
  class="px-2 w-fit border rounded-[20px] items-center justify-center inline-flex shrink-0 {getColorClass(
    color,
  )} {className}"
>
  <span class="text-xs font-normal">
    {#if text !== ""}
      {text}
    {:else}
      <slot />
    {/if}
  </span>
</div>
