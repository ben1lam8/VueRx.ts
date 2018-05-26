<template>
    <div id="app">
        <p>
            Clock count: {{ticksCount}}<br/>
            User clicks count: {{userClicksCount}}<br/>
            Merged stream total: {{total}}<br/>
        </p>

        <button id="button">Click !</button>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { Observable, interval, fromEvent, merge } from 'rxjs';

    @Component
    export default class App extends Vue {

        ticksCount: number = 0;
        userClicksCount: number= 0;
        total: number = 0;

        clock$?: Observable<number>;

        created(): void {
            this.clock$ = interval(1000);

            this.clock$.subscribe(
                tick =>  {
                    this.ticksCount++;
                }
            );
        }

        mounted(): void {
            let button = document.querySelector("#button") as Element;

            const click$ = fromEvent(button, 'click');

            click$.subscribe(
                event =>  {
                    this.userClicksCount++;
                } );

            let total$ = merge(this.clock$, click$);

            total$.subscribe(
                next => {
                    this.total++;
                }
            )
        }

    }
</script >

<style scoped>

</style>
