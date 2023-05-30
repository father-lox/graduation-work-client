export default class ScreenScrolling {
    constructor(
        private containerScreens: HTMLElement,
        private screens: HTMLElement[],
        private loadScreens?: () => Promise<HTMLElement[] | null>
    ) {
        if (screens.length >= 0 && loadScreens) {
            screens.forEach(screen => this.attachScreen(screen));

            this.attachLoadedScreens().then(() => {
                this.screens[this.currentScreen].classList.remove(this.classes.nextScreen);
                this.containerScreens.dispatchEvent(this.customEvents.screenScrollingInit);
                this.restartWatchTimer();
            });
        } else if (screens.length === 0 && !loadScreens) {
            throw new Error('The array of screens is empty');
        }

        this.containerScreens.classList.add(this.classes.container);
        this.initKeydownEventOnContainerScreens();
        this.initWheelEventOnContainerScreens();
        this.containerScreens.addEventListener('transitionend', this.activateSwitching);
    }

    get currentScreenNumber() {
        return this.currentScreen;
    }

    static availableEvents = {
        screenScrollingInit: 'screen-scrolling-init',
        screenSwitched: 'screen-switched',
        screenWatched: 'screen-watched',
    }
    //TODO: При слабом скроле смещать новость, выполнять поготовку к анимации
    //TODO: Если скрол был не достаточно сильный, обнулять switchAccumulator
    //TODO: Реализовать поддержку touchscreens

    private readonly nextSwitchThreshold: number = 64;
    private readonly previousSwitchThreshold: number = -this.nextSwitchThreshold;
    private switchAccumulator: number = 0;
    private isSwitchable: boolean = true;
    private timeTriggerWatch = 5000;
    private watchTimerId: number | undefined;

    private currentScreen: number = 0;
    private classes = {
        container: 'screen-scrolling',
        screens: 'screen-scrolling__item',
        nextScreen: 'screen-scrolling_next',
        previousScreen: 'screen-scrolling_previous'
    }

    private customEvents = {
        screenSwitched: new Event(ScreenScrolling.availableEvents.screenSwitched, {
            bubbles: true
        }),
        screenScrollingInit: new Event(ScreenScrolling.availableEvents.screenScrollingInit, {
            bubbles: true
        }),
        screenWatched: new Event(ScreenScrolling.availableEvents.screenWatched, {
            bubbles: true,
        }),
    }

    private canNextSwitch = (): boolean => {
        return this.switchAccumulator >= this.nextSwitchThreshold && this.isSwitchable;
    }

    private canPreviousSwitch = (): boolean => {
        return this.switchAccumulator <= this.previousSwitchThreshold && this.isSwitchable;
    }

    private blockSwitching = () => {
        this.isSwitchable = false;
    }

    private activateSwitching = (event: Event) => {
        if (event.target === this.screens[this.currentScreen]) {
            this.isSwitchable = true;
            this.resetSwitchAccumulator();
        }
    }

    private resetSwitchAccumulator = () => {
        this.switchAccumulator = 0;
    }

    private initWheelEventOnContainerScreens() {
        this.containerScreens.addEventListener('wheel', event => {
            this.switchAccumulator += event.deltaY;

            if (this.canNextSwitch()) {
                this.switchNext();
            }
            else if (this.canPreviousSwitch()) {
                this.switchPrevious();
            }
        });
    }

    private initKeydownEventOnContainerScreens() {
        window.addEventListener('keydown', (event) => {
            if (this.isSwitchable && event.code === 'ArrowDown' && !event.repeat) {
                this.switchNext();
            }
            else if (this.isSwitchable && event.code === 'ArrowUp' && !event.repeat) {
                this.switchPrevious();
            }
        });
    }

    private switchNext = () => {
        if (window.pageYOffset !== window.scrollY) {
            return;
        }

        if (this.currentScreen + 1 < this.screens.length) {
            this.blockSwitching();
            this.screens[this.currentScreen].classList.add(this.classes.previousScreen);
            this.currentScreen++;
            this.screens[this.currentScreen].classList.remove(this.classes.nextScreen);
        }
        if (this.currentScreen === this.screens.length - 1 && this.loadScreens) {
            this.attachLoadedScreens();
        }

        window.scroll(0, 0);
        this.screens[this.currentScreen].dispatchEvent(this.customEvents.screenSwitched);
        this.restartWatchTimer();
    }

    private switchPrevious = () => {
        if (this.currentScreen > 0 && window.pageYOffset === 0) {
            this.blockSwitching();
            this.screens[this.currentScreen].classList.add(this.classes.nextScreen);
            this.currentScreen--;
            this.screens[this.currentScreen].classList.remove(this.classes.previousScreen);
            this.restartWatchTimer();
        } else {
            this.resetSwitchAccumulator();
        }
    }

    private attachLoadedScreens = async () => {
        if (!this.loadScreens) {
            return;
        }
        const data = await this.loadScreens();

        if (data === null) {
            return;
        }

        data.forEach(element => {
            this.attachScreen(element);
            this.screens.push(element);
        });
    }

    private attachScreen(screen: HTMLElement) {
        screen.classList.add(this.classes.nextScreen, this.classes.screens);
        this.containerScreens.append(screen);
    }

    private restartWatchTimer = () => {
        if (this.watchTimerId) {
            clearTimeout(this.watchTimerId);
        }
        
        this.watchTimerId = setTimeout(this.notifyAboutScreenWatched, this.timeTriggerWatch);
    }

    private notifyAboutScreenWatched = () => {
        this.screens[this.currentScreen].dispatchEvent(this.customEvents.screenWatched);
    }
}