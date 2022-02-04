<template>
  <ion-page>
    <ion-header>
      <ion-icon slot="start" name="calendar-clear-outline"></ion-icon>
      {{ notification.title }}
    </ion-header>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonIcon } from "@ionic/vue";

enum NotificationType {
  PUSH,
  EVENT,
}

const notification = {
  id: 0,
  type: NotificationType.PUSH,
  title: "Inscripciones abiertas!",
  body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, voluptatum. Nam odit ad praesentium numquam optio vero vel vitae eligendi, ipsa porro suscipit iure accusamus et cum distinctio! Repellat voluptas, minus et nulla iste velit mollitia ea quis magnam quo soluta veritatis libero commodi quibusdam neque aliquam quidem id ducimus? Tenetur nesciunt magnam ipsa quos perferendis, consectetur consequuntur sapiente id reiciendis eius. Unde nisi nobis consectetur accusamus, exercitationem, veniam quos nesciunt repellat, nihil ducimus illum quisquam reiciendis excepturi! Earum, quod omnis ea nostrum quia, ipsam alias quae officia fuga mollitia repellendus, in enim itaque adipisci. Facere dignissimos ullam eius dolor!",
};
</script>

<style></style>
