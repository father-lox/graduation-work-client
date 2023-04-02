export default function autoResizeHeightTextarea(textareaElement: HTMLTextAreaElement) {
	let lengthText: number = textareaElement.value.length;

	textareaElement.addEventListener('input', () => {
		if (textareaElement.value.length > lengthText) {
			textareaElement.style.height = textareaElement.scrollHeight + 'px';
		} else if (textareaElement.value.length < lengthText) {
			textareaElement.style.height = 'auto';
			textareaElement.style.height = textareaElement.scrollHeight + 'px';
		}

		lengthText = textareaElement.value.length;
	})
}