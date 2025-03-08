<script setup>
import RouterButtonWithIcon from '@/components/RouterButtonWithIcon.vue';
</script>

<template>
  <div>
    <div class="container">
      <h1 class="title">How to Use</h1>

      <Panel header="STEP 1: Add Names of People Involved">
        <Image src="/images/ss1.png" class="ss-first" />
        <p class="m-0">
          Enter a name, then click add. Add the names of the people involved in the splitting of costs.
          Note: if you delete a name, all relevant items related to that name will be deleted.
        </p>
      </Panel>
      <Panel header="STEP 2: Add List of Items">
        <Image src="/images/ss2.png" class="ss-second" />
        <p class="m-0">
          Enter the name of the person who paid for an item.
          Choose from the list of parties who will split the cost for that item.
          Note: You can toggle between 'By Item' or 'By Name' to view the list of items.
        </p>
      </Panel>
      <Panel header="STEP 3: Click on Summary">
        <Image src="/images/ss3.png" class="ss-third" />
        <p class="m-0">
          You will be routed to the Summary page
        </p>
      </Panel>
      <div class="buttons">
        <RouterButtonWithIcon icon-name="play" route="/calculate" label="Start Calculating"></RouterButtonWithIcon>
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  height: 80vh;
  width: 80vw;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 auto;
  padding: 40px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.ss-first :deep(img) {
  height: 100%;
  width: 100%;
  max-height: 250px;
  max-width: 300px;
}

.ss-second :deep(img) {
  height: 100%;
  width: 100%;
  max-height: 450px;
  max-width: 460px;
}

.ss-third :deep(img) {
  height: 100%;
  width: 100%;
  max-height: 350px;
  max-width: 200px;
}

.buttons {
  max-width: 200px;
  height: 100%;
  width: 100%;
  padding-bottom: 30px;
}

@media (max-width: 800px) {
  .container {
    padding: 54px 0px 0px 0px;
  }
}
</style>
