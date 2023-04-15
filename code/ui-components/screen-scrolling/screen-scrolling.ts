export default class ScreenScrolling {
    constructor(
        private containerScreens: HTMLElement,
        private screens: HTMLElement[],
        private loadScreens?: () => Promise<HTMLElement[]>
    ) {
        if (screens.length === 0 && loadScreens) {
            this.attachLoadedScreens().then(() => {
                this.screens[this.currentScreen].classList.remove(this.classes.nextScreen);
            });
        } else if (screens.length === 0 && !loadScreens) {
            throw new Error('The array of screens is empty');
        }

        this.containerScreens.classList.add(this.classes.container);
        this.initKeydownEventOnContainerScreens();
        this.initWheelEventOnContainerScreens();
        this.containerScreens.addEventListener('transitionend', this.activateSwitching);
    }

    //TODO: При слабом скроле смещать новость, выполнять поготовку к анимации
    //TODO: Если скрол был не достаточно сильный, обнулять switchAccumulator
    //TODO: Реализовать поддержку touchscreens

    private readonly nextSwitchThreshold: number = 64;
    private readonly previousSwitchThreshold: number = -this.nextSwitchThreshold;
    private switchAccumulator: number = 0;
    private isSwitchable: boolean = true;

    private currentScreen: number = 0;
    private classes: {
        container: string,
        screens: string,
        nextScreen: string,
        previousScreen: string
    } = {
        container: 'screen-scrolling',
        screens: 'screen-scrolling__item',
        nextScreen: 'screen-scrolling_next',
        previousScreen: 'screen-scrolling_previous'
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
    }

    private switchPrevious = () => {
        if (this.currentScreen > 0 && window.pageYOffset === 0) {
            this.blockSwitching();
            this.screens[this.currentScreen].classList.add(this.classes.nextScreen);
            this.currentScreen--;
            this.screens[this.currentScreen].classList.remove(this.classes.previousScreen);
        } else {
            this.resetSwitchAccumulator();
        }
    }

    private attachLoadedScreens = async () => {
        if (this.loadScreens) {
            (await this.loadScreens()).forEach(element => {
                element.classList.add(this.classes.nextScreen, this.classes.screens);
                this.containerScreens.append(element);
                this.screens.push(element);
            });
        }
    }
}