class inputExpressive {
  constructor(private field: HTMLTextAreaElement) {
    this.initAutoResize();
  }

  private initAutoResize() {
    this.field.addEventListener('input', this.autoResizeHight);
  }

  private autoResizeHight() {
    this.field.style.height = `${this.field.scrollHeight}px`;
  }
}