<script lang="ts">
  import FormSection from "@rilldata/web-common/components/forms/FormSection.svelte";
  import InputArray from "@rilldata/web-common/components/forms/InputArray.svelte";
  import Input from "@rilldata/web-common/components/forms/Input.svelte";
  import Select from "@rilldata/web-common/components/forms/Select.svelte";
  import { getHasSlackConnection } from "@rilldata/web-common/features/alerts/delivery-tab/notifiers-utils";
  import { SnoozeOptions } from "@rilldata/web-common/features/alerts/delivery-tab/snooze";
  import type { AlertFormValues } from "@rilldata/web-common/features/alerts/form-utils";
  import { runtime } from "@rilldata/web-common/runtime-client/runtime-store";
  import type { createForm } from "svelte-forms-lib";

  export let formState: ReturnType<typeof createForm<AlertFormValues>>;

  const { form, errors, handleChange } = formState;
  $: ({ instanceId } = $runtime);

  $: hasSlackNotifier = getHasSlackConnection(instanceId);
</script>

<div class="flex flex-col gap-y-3">
  <FormSection title="Alert name">
    <Input
      alwaysShowError
      errors={$errors["name"]}
      id="name"
      onInput={(_, e) => handleChange(e)}
      placeholder="My alert"
      value={$form["name"]}
    />
  </FormSection>
  <FormSection
    description="We'll check for this alert whenever the data refreshes"
    title="Trigger"
  />
  <FormSection
    description="Set a snooze period to silence repeat notifications for the same alert."
    title="Snooze"
  >
    <Select
      bind:value={$form["snooze"]}
      id="snooze"
      label=""
      options={SnoozeOptions}
    />
  </FormSection>
  {#if $hasSlackNotifier.data}
    <FormSection
      bind:enabled={$form["enableSlackNotification"]}
      showSectionToggle
      title="Slack notifications"
    >
      <InputArray
        accessorKey="channel"
        addItemLabel="Add channel"
        description="We’ll send alerts directly to these channels."
        {formState}
        id="slackChannels"
        label="Channels"
        placeholder="# Enter a Slack channel name"
      />
      <InputArray
        accessorKey="email"
        addItemLabel="Add user"
        description="We’ll alert them with direct messages in Slack."
        {formState}
        id="slackUsers"
        label="Users"
        placeholder="Enter an email address"
      />
    </FormSection>
  {:else}
    <FormSection title="Slack notifications">
      <svelte:fragment slot="description">
        <span class="text-sm text-slate-600">
          Slack has not been configured for this project. Read the <a
            href="https://docs.rilldata.com/explore/alerts/slack"
            target="_blank"
          >
            docs
          </a> to learn more.
        </span>
      </svelte:fragment>
    </FormSection>
  {/if}
  <FormSection
    bind:enabled={$form["enableEmailNotification"]}
    description="We’ll email alerts to these addresses. Make sure they have access to your project."
    showSectionToggle
    title="Email notifications"
  >
    <InputArray
      accessorKey="email"
      addItemLabel="Add email"
      {formState}
      id="emailRecipients"
      placeholder="Enter an email address"
    />
  </FormSection>
</div>
