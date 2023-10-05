import { useState } from 'react';
import './app.scss';
import './button.scss'
import ThinTemplate from './templates/ThinTemplate/thin-template';
import ReactMarkdown from 'react-markdown';
import objective from './objective.js';
import rehypeRaw from 'rehype-raw';

const options = [
    { value: null, label: 'All' },
    { value: 100, label: '$100' },
    { value: 200, label: '$200' },
    { value: 300, label: '$300' },
    { value: 400, label: '$400' },
    { value: 500, label: '$500' },
]


function App() {
    const [selected, setSelected] = useState([]);

    function updateButtonStyle(selectedOptions) {
        selectedOptions.forEach((option) =>
            document.getElementById(option.label).style.backgroundColor = '#A0A1A2'
        );

        const deselectedOptions = options.filter(o => !selectedOptions.includes(o));
        deselectedOptions.forEach((option) =>
            document.getElementById(option.label).style.backgroundColor = 'white'
        );
    }

    function selectRangeOfOptions(selectedOptions) {
        if (selectedOptions.length <= 1) {
            return selectedOptions;
        }

        let max = selectedOptions[0].value;
        let min = selectedOptions[0].value;
        selectedOptions.forEach((option) => {
            if (option.value > max) {
                max = option.value;
            } else if (option.value < min) {
                min = option.value;
            }
        });

        return options.filter(o => o.value >= min && o.value <= max);
    }

    function buttonClicked(option) {
        let updatedSelected = selected;
        if (selected.filter(o => o.value == option.value).length > 0) {
            // If option already in selected, remove from selected
            updatedSelected = selected.filter(o => o.value !== option.value);
        } else if (option.value == null) {
            // If option is ALL, clear selected and only keep ALL
            updatedSelected = [option];
        } else {
            // Adding new option to selected
            let allList = selected.filter(o => o.value == null);
            if (selected.filter(o => o.value == null).length > 0) {
                // Remove ALL if it's in selected 
                updatedSelected = selected.filter(o => o.value !== null);
            }
            updatedSelected = selectRangeOfOptions([...updatedSelected, option])
        }
        setSelected(updatedSelected);

        // Update UI: set updatedSelected to 'selected' and set all others to 'deselected'
        updateButtonStyle(updatedSelected);
    }

    return (
        <ThinTemplate instructionTitle="Front-end Interview">
            <div class='options'>
                {options.map((option) => (
                    <button
                        type='button'
                        key={option.value}
                        id={option.label}
                        onClick={() => buttonClicked(option)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <ReactMarkdown rehypePlugins={[rehypeRaw]} className='markdown' children={objective} />

            <h2>Selected State</h2>
            <pre>
                {JSON.stringify(selected, null, 2)}
            </pre>
        </ThinTemplate>
    );
}

export default App;
