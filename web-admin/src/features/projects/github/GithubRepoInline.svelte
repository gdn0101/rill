<script lang="ts">
  import { getRepoNameFromGithubUrl } from "@rilldata/web-common/features/project/github-utils";

  export let githubUrl: string;

  const repoName = getRepoNameFromGithubUrl(githubUrl);
</script>

<a
  href={githubUrl}
  target="_blank"
  class="font-semibold font-mono text-gray-800 text-[16px] leading-5"
  rel="noreferrer noopener"
>
  {repoName}
</a>
