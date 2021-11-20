const createAutoComplete = ({ root, renderOption, onSelectOption, inputValue, fetchData }) => {
    root.innerHTML = `
        <label><b>Search For A item</b></label>
        <div class="dropdown">
            <input type="text" name="" id="input">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `

    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');
    const input = root.querySelector('#input');

    const onInput = async(e) => {
        const items = await fetchData(e.target.value);
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');
        for (let item of items) {
            const option = document.createElement('a');

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);
                onSelectOption(item);
            })
            resultsWrapper.appendChild(option);
        }
    }

    input.addEventListener('input', debounce(onInput));
    document.addEventListener('click', e => {
        if (!root.contains(e.target)) {
            dropdown.classList.remove('is-active');
        }
    })
}