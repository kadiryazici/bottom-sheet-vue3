<template>
   <div class="_main mx-auto">
      <h3 class="text-center">Examples & with Custom Options</h3>
      <SelfCloseBySlot />
      <br />
      <RadiusExample />
      <br />
      <CustomIcon />
      <br />
      <CustomDimensions />
      <br />
      <Threshold />
      <br />
      <CustomColors />
      <br />
      <ClickOutside />
      <br />
      <SheetByAnother />
   </div>
</template>

<script lang="ts" setup>
import RadiusExample from '/src/components/Examples/NoRadius.vue';
import CustomIcon from '/src/components/Examples/CustomIcon.vue';
import CustomDimensions from '/src/components/Examples/CustomDimensions.vue';
import Threshold from '/src/components/Examples/Threshold.vue';
import CustomColors from '/src/components/Examples/CustomColors.vue';
import ClickOutside from '/src/components/Examples/ClickOutside.vue';
import SheetByAnother from '/src/components/Examples/SheetByAnother.vue';
import SelfCloseBySlot from '/src/components/Examples/SelfCloseBySlot.vue';
</script>
