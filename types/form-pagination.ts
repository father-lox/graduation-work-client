export type FormFragment = HTMLElement;

export type ProgressElement = HTMLButtonElement;

export type RegressElement = HTMLButtonElement;

export type validateAdditionalCallback = (input: FormFragment) => Promise<boolean> | boolean;

export type submitCallback = (event: Event) => void;

export type FormPaginationOptions = {
    fragments: FormFragment[] | string,
    visible: number,
    validateAdditional?: validateAdditionalCallback,
    submitButtonText: string,
    progressElement: HTMLButtonElement | string,
    regressElement: HTMLButtonElement | string,
}