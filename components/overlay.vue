<template>
    <b-overlay variant="transparent" blur="5px" opacity="1" :class="{'overlay-loader': !isField, 'with-heading': withHeading}" :show="show" rounded>
        <template v-if="!isField" #overlay>
            <div class="text-center loading-content">
                <div v-if="!$slots.overlay">
                    <b-spinner label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                    <p class="mt-3 font-weight-bold">Please wait while the system is loading your data.</p>
                </div>
                <slot name="overlay" v-else />
            </div>
        </template>
        <slot />
    </b-overlay>
</template>
<script>
    export default {
        props: {
            isField: {
                type: Boolean,
                default: false
            },
            show: {
                type: Boolean,
                default: false
            },
            withHeading: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
<style scoped lang="scss">
    .overlay-loader {
        &.with-heading {
            height: calc(100vh - 231px)
        }
        .loading-content {
            p {
                font-size: 17px;
            }
        }
    }
    .modal-body {
        .overlay-loader {
            min-height: 200px;
        }
    }
</style>