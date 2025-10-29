
import Konva from 'konva';
import type { View } from '../../types.ts';
import { STAGE_WIDTH } from '../../constants.ts';

/*
ReferenceScreenView makes the reference screen view
*/
export class ReferenceScreenView implements View {
    private group: Konva.Group;

    constructor(onExitClick: () => void) {
        this.group = new Konva.Group({ visible: true});

        //Title Text
        const titleText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 50,
            text: 'References',
            fontSize: 36,
            fontFamily: 'Comic Sans MS',
            fill: 'white',
            align: 'center',
        });
        titleText.offsetX(titleText.width() / 2);
        this.group.add(titleText);

        const exitButtonGroup = new Konva.Group();
        const exitButton = new Konva.Rect({
            x: STAGE_WIDTH - 110,
            y: 300,
            width: 200,
            height: 50,
            fill: 'red',
            cornerRadius: 10,
            stroke: "darkred",
            strokeWidth: 4,
        });

        const exitButtonText = new Konva.Text({
            x: STAGE_WIDTH - 10,
            y: 315,
            text: 'Exit',
            fontSize: 20,
            fontFamily: 'Comic Sans MS',
            fill: 'white',
            align: 'center',
        });
        exitButtonText.offsetX(exitButtonText.width() / 2);
        exitButtonGroup.add(exitButton);
        exitButtonGroup.add(exitButtonText);
        exitButtonGroup.on('click', onExitClick);
        this.group.add(exitButtonGroup);
    }

    /*
    Show the screen
    */
    show(): void {
        this.group.visible(true);
        this.group.getLayer()?.draw();
    }

    /*
    Hide the screen
    */
    hide(): void {
        this.group.visible(false);
        this.group.getLayer()?.draw();
    }

    getGroup(): Konva.Group {
        return this.group;
    }

        
}