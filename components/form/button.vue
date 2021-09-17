<template>
    <b-button :variant=variant>
        <b-spinner label="Spinning" v-if="isSubmitted"></b-spinner>
        <template v-if="!isSubmitted">
            <slot v-if="$slots.default" />
            <span v-else>Save</span>
        </template>
    </b-button>
</template>
<script>
    export default {
        props: {
            isSubmitted: {
                type: Boolean,
                default: false
            },
            variant: {
                default: "primary"
            }
        }
    }
</script>