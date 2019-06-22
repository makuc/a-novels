import { HammerGestureConfig } from '@angular/platform-browser';

declare var Hammer: any;
export class MyHammerConfig extends HammerGestureConfig {
    buildHammer(element: HTMLElement) {
        let options = {};

        if (element.attributes['data-mc-options']) {
            try {
                // tslint:disable-next-line: prefer-const
                let parseOptions = JSON.parse(element.attributes['data-mc-options'].nodeValue);
                options = parseOptions;
            } catch (err) {
                console.error('An error occurred when attempting to parse Hammer.js options: ', err);
            }
        }
        const mc = new Hammer(element, options);

        // keep default angular config
        mc.get('pinch').set({ enable: true });
        mc.get('rotate').set({ enable: true });

        // retain support for angular overrides object
        // tslint:disable-next-line: forin
        for (const eventName in this.overrides) {
            mc.get(eventName).set(this.overrides[eventName]);
        }

        return mc;
    }
}
