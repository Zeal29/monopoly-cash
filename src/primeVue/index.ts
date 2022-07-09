import { App } from "vue";
import "primevue/resources/themes/md-dark-deeppurple/theme.css";
import "primevue/resources/primevue.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Card from "primevue/card";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmPopup from "primevue/confirmpopup";
import ConfirmationService from "primevue/confirmationservice";
import DialogService from "primevue/dialogservice";
import Divider from "primevue/divider";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Row from "primevue/row";
import Password from "primevue/password";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import PrimeVue from "primevue/config";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";

export function setupPrimeVue(app: App<Element>) {
	app.use(PrimeVue, { ripple: true });

	app.use(ConfirmationService);
	app.use(ToastService);
	app.use(DialogService);

	app.directive("ripple", Ripple);
	app.directive("styleclass", StyleClass);

	app.component("Dialog", Dialog);
	app.component("Button", Button);
	app.component("Card", Card);
	app.component("Checkbox", Checkbox);
	app.component("Column", Column);
	app.component("ColumnGroup", ColumnGroup);
	app.component("ConfirmDialog", ConfirmDialog);
	app.component("ConfirmPopup", ConfirmPopup);
	app.component("ConfirmationService", ConfirmationService);
	app.component("DialogService", DialogService);
	app.component("Divider", Divider);
	app.component("InputSwitch", InputSwitch);
	app.component("InputText", InputText);
	app.component("InputNumber", InputNumber);
	app.component("Row", Row);
	app.component("Password", Password);
	app.component("ProgressSpinner", ProgressSpinner);
	app.component("Toast", Toast);
}
