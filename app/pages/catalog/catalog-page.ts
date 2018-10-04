import { EventData } from "data/observable";
import { Page } from "ui/page";

import { CatalogViewModel } from "./catalog-view-model";

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new CatalogViewModel();
}
