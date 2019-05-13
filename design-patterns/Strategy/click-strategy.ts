export interface ClickStrategy {
    onClick(e: any): void;
}

// Could be Iframe, Body, SomethingElse
export interface WorkingArea {
    showPopover(e: any): void;
    thereIsSelectedText(): boolean;
    // and every single method related to the working area
}

// Could be click on image, dropdown, text, link, navigation, etc... Could save in DB, could send requests.
export interface ClickHandler {
    handle(e: any): void;
}

export interface DomTranslator {
    isLink(el: any): boolean;
    isImage(el: any): boolean;
}

export class ClickInEditMode implements ClickStrategy {
    constructor(
        private area: WorkingArea,
        private domTranslator: DomTranslator,
        private onImageClick: ClickHandler,
        private onLinkClick: ClickHandler) { }

    // private properties for edit mode
    onClick(e: any): void {
        if (this.domTranslator.isLink(e)) {
            this.onLinkClick.handle(e);
            this.area.showPopover("link");
        } else if (this.domTranslator.isImage(e)) {
            this.onImageClick.handle(e);
            this.area.showPopover("image");
        } else if (this.area.thereIsSelectedText()) {
            this.area.showPopover("text-editor");
        }
    }
}

export class ClickInRealMode implements ClickStrategy {
    constructor(
        private area: WorkingArea,
        private domTranslator: DomTranslator,
        private onHiperLinkClick: ClickHandler,
        private onTabClick: ClickHandler) { }

    // private properties for edit mode
    onClick(e: any): void {
        if (this.domTranslator.isLink(e)) {
            this.onHiperLinkClick.handle(e);
            this.area.showPopover("hiper-link");
        } else if (this.isTab(e)) {
            this.onTabClick.handle(e);
            this.area.showPopover("tab");
        }
    }

    private isTab(e: any): boolean {
        // logic
        return true;
    }
}

export class EditorComponent {
    private isEditMode;
    private clickStrategy: ClickStrategy;

    constructor() {
        this.isEditMode = false;
        this.chooseClickStrategy(this.isEditMode);
    }

    switchMode() {
        this.isEditMode = !this.isEditMode;
        this.chooseClickStrategy(this.isEditMode);
    }

    onClick(e) {
        this.clickStrategy.onClick(e);
    }

    chooseClickStrategy(isEditMode) {
        this.clickStrategy = ClickStrategiesPool.for(isEditMode);
    }
}

// <body (click)="onClick($event)">
//      <div (click="switchMode()")>
//          <span> EDIT MODE IS </span>
//          <span *ngIf="isEditMode">ON</span>
//          <span *ngIf="!isEditMode">OFF</span>
//      </div>
//      html.......
// </body>

export class ClickStrategiesPool {
    public static for(isEditMode) {
        return isEditMode
            ? this.editModeStrategy()
            : this.realModeStrategy();
    }

    private static editModeStrategy(): ClickStrategy {
        return new ClickInEditMode(
            new IFrameWorkingArea(),
            new DomTranslator(),
            new ImageClickHandler(),
            new LinkClickHandler()
        );
    }

    private static realModeStrategy(): ClickStrategy {
        return new ClickInRealMode(
            new IFrameWorkingArea(),
            new DomTranslator(),
            new HiperLinkClickHandler(),
            new BootstrapTabClickHandler()
        );
    }
}
