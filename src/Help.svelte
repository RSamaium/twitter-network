<script>
let display = true

function hide() {
    display = false
}
</script>

{#if display}
<div class="ui segment">
    <i class="delete icon" on:click={hide}></i>
    <img src="/images/drag-right.gif" class="ui avatar image"><span>Déplacement: cliquez et déplacez avec la souris</span>
    <br>
    <img src="/images/scroll_down.gif" class="ui avatar image"><span>Zoom: molette de la souris ou double-clic</span>
</div>
{/if}

<style>
.segment {
    position: relative;
    font-size: 12px;
    opacity: 0.8;
}

.delete {
    position: absolute;
    top: 5px;
    right:5px;
    cursor: pointer;
}

.image {
    border-radius: 0 !important;
}
</style>