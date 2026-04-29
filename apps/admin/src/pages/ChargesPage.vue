<template>
  <q-card flat bordered>
    <q-card-section class="q-pb-none">
      <q-avatar
        class="secondary-gradient q-mr-sm"
        :icon="$icon('masters-charges')"
        rounded
        size="md"
      />{{ $t('navi.masters-charges') }}
      <q-separator class="q-mt-sm" />
    </q-card-section>

    <q-card-section>
      <q-banner rounded class="bg-orange-1 text-orange-9">
        <template #avatar>
          <q-icon name="sym_o_construction" color="orange" />
        </template>
        工事中
      </q-banner>
    </q-card-section>
  </q-card>
</template>
