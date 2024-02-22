import { ProAppConfig } from "@totvs/protheus-lib-core";

export class ProAppConfigServiceMock {
    loadAppConfig(): Promise<object> { return; };
    callAppClose(ask?: boolean): void { return; };
    insideProtheus(): boolean { return; };
    get proAppConfig(): ProAppConfig { return; };
    get nameApp(): string { return; };
    get serverWithApiUrl(): string { return; };
    get productLine(): string { return; };
    get isProtheusRender(): boolean { return; };
    freeAppConfig(): void { return; };
}