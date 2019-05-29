enum Filter {
    filter_1,
    filter_2,
    filter_3,
    filter_4,
    filter_5,
    filter_6,
    filter_7,
    filter_8,
}

// TODO you can implement whatever you want here
class LayoutBuilder {
    private vof: Map<Filter, boolean>;

    constructor() {
        this.vof = new Map<Filter, boolean>();
        this.vof.set(Filter.filter_1, true);
        this.vof.set(Filter.filter_2, true);
        this.vof.set(Filter.filter_3, true);
        this.vof.set(Filter.filter_4, true);
        this.vof.set(Filter.filter_5, true);
        this.vof.set(Filter.filter_6, true);
        this.vof.set(Filter.filter_7, true);
        this.vof.set(Filter.filter_8, true);
    }

    public setVisibilityFor(filter: Filter, isVisible: boolean): void {
        this.vof.delete(filter);
        this.vof.set(filter, isVisible);
    }

    public buildLayout(): Map<Filter, string> {
        if (this.isEverythingVisible()) {
            return this.layoutWhenEverythingIsVisible();
        } else if (this.onlyFilter3IsNotVisible()) {
            return this.layoutWhenOnlyFilter3IsNotVisible();
        } else {
            throw new Error("Unpredicted layout condition")
        }
    }

    private isEverythingVisible(): boolean {
        return Array.from(this.vof.values()).filter(isVisible => !isVisible).length === 0;
    }

    private layoutWhenEverythingIsVisible(): Map<Filter, string> {
        const layout = new Map<Filter, string>();
        layout.set(Filter.filter_1, 'col-md-12');
        layout.set(Filter.filter_2, 'col-md-12');
        layout.set(Filter.filter_3, 'col-md-12');
        layout.set(Filter.filter_4, 'col-md-12');
        layout.set(Filter.filter_5, 'col-md-12');
        layout.set(Filter.filter_6, 'col-md-12');
        layout.set(Filter.filter_7, 'col-md-12');
        layout.set(Filter.filter_8, 'col-md-12');
        return layout;
    }

    private onlyFilter3IsNotVisible(): boolean {
        let statementIsTrue = true;
        this.vof.forEach((value, key) => {
            if (key == Filter.filter_3 && value == true) {
                statementIsTrue = false;
            } else if (key != Filter.filter_3 && value == false) {
                statementIsTrue = false;
            }
        });

        return statementIsTrue;
    }

    private layoutWhenOnlyFilter3IsNotVisible(): Map<Filter, string> {
        const layout = new Map<Filter, string>();
        layout.set(Filter.filter_1, 'col-md-6');
        layout.set(Filter.filter_2, 'col-md-6');
        layout.set(Filter.filter_3, '');
        layout.set(Filter.filter_4, 'col-md-12');
        layout.set(Filter.filter_5, 'col-md-12');
        layout.set(Filter.filter_6, 'col-md-4');
        layout.set(Filter.filter_7, 'col-md-4');
        layout.set(Filter.filter_8, 'col-md-4');
        return layout;
    }
}

class LayoutMediator {
    private externalHandlers;
    private layoutBuilder: LayoutBuilder;

    constructor() {
        this.externalHandlers = [];
        this.layoutBuilder = new LayoutBuilder();
    }

    public subscribeForLayoutChanges(handler: (layout: Map<Filter, string>) => void): void {
        this.externalHandlers.push(handler);
        this.notifyEveryone(this.layoutBuilder.buildLayout());
    }

    public changeVisibilityOf(filter: Filter, isVisible: boolean): void {
        this.layoutBuilder.setVisibilityFor(filter, isVisible);
        this.notifyEveryone(this.layoutBuilder.buildLayout());
    }

    private notifyEveryone(layout: Map<Filter, string>): void {
        console.log("%c emit the latest layout to everyone \n", 'color: red;');
        this.externalHandlers.forEach(handler => {
            handler(layout);
        });
        console.log("\n\n\n");
    }
}

class FiltersOneAndTwo {

    constructor(private mediator: LayoutMediator) {
        this.mediator.subscribeForLayoutChanges(this.onLayoutChange);
    }

    public setFilterOneVisibility(visibility) {
        this.mediator.changeVisibilityOf(Filter.filter_1, visibility);
    }

    public setFilterTwoVisibility(visibility) {
        this.mediator.changeVisibilityOf(Filter.filter_2, visibility);
    }

    private onLayoutChange(layout: Map<Filter, string>): void {
        console.log("Filters one and two received the following layout: ");
        console.log(layout);
    }
}

class FilterThree {

    constructor(private mediator: LayoutMediator) {
        this.mediator.subscribeForLayoutChanges(this.onLayoutChange);
    }

    public setFilterVisibility(visibility) {
        this.mediator.changeVisibilityOf(Filter.filter_3, visibility);
    }

    private onLayoutChange(layout: Map<Filter, string>): void {
        console.log("Filter three received the following layout: ");
        console.log(layout);
    }
}

class FiltersFromFourToEight {

    constructor(private mediator: LayoutMediator) {
        this.mediator.subscribeForLayoutChanges(this.onLayoutChange);
    }

    private onLayoutChange(layout: Map<Filter, string>): void {
        console.log("Filters from four to eight received the following layout: ");
        console.log(layout);
    }
}

(() => {
    const mediator = new LayoutMediator();

    const filtersOneAndTwo = new FiltersOneAndTwo(mediator);
    const filterThree = new FilterThree(mediator);
    const filtersFromFourToEight = new FiltersFromFourToEight(mediator);

    filterThree.setFilterVisibility(false);
})()