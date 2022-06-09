import React from 'react';
import { useState, useEffect } from 'react';
import './Autocomplete.scss';

interface AutoCompleteProps {
	minChars?: number;
	delay?: number;
}

interface User {
	id: number;
	name: string;
	username: string;
	email: string;
	address: {
		street: string;
		suite: string;
		city: string;
		zipcode: string;
		geo: {
			lat: string;
			lng: string;
		};
	};
	phone: string;
	website: string;
	company: {
		name: string;
		catchPhrase: string;
		bs: string;
	};
}

interface Suggestion {
	label: string;
	value: string;
}

const API_ENDPOINT = 'https://jsonplaceholder.typicode.com/users';
const DEFAULT_DELAY = 500;
const DEFAULT_MIN_CHARS = 3;

const Autocomplete = (props: AutoCompleteProps): JSX.Element => {
	const [value, setValue] = useState<string>('');
	const [selectedSuggestion, setSelectedSuggestion] =
		useState<Suggestion | null>(null);
	const [data, setData] = useState<Suggestion[]>([]);
	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
	const [activeSuggestion, setActiveSuggestion] = useState(-1);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const minChars = props.minChars || DEFAULT_MIN_CHARS;
	const delay = props.delay || DEFAULT_DELAY;
	let timeout: ReturnType<typeof setTimeout>;

	useEffect(() => {
		// The fetch call will be executed twice because the useEffect hooks is running twice. This is a known bug in React 18
		// https://github.com/facebook/react/issues/24553
		fetch(API_ENDPOINT)
			.then((response) => response.json())
			.then((data) => {
				const s: Suggestion[] = data.map((user: User) => {
					return {
						label: user.name,
						value: user.name,
					};
				});
				setData(s);
			})
			.catch((error) => console.log(error));

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	const changeHandler = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const typedString = event.target.value;
		setValue(typedString);
		setSuggestions([]);
		if (typedString.length >= minChars) {
			if (timeout) {
				clearTimeout(timeout);
			}
			setTimeout(async () => {
				setActiveSuggestion(-1);
				setIsLoading(true);
				const suggestions = await getSuggestions(typedString);
				setSuggestions(suggestions);
				setIsLoading(false);
			}, delay);
		}
	};

	const selectHandler = (s: Suggestion): void => {
		selectSuggestion(s);
	};

	const clearHandler = (): void => {
		resetSearch();
	};

	const resetSearch = (): void => {
		setSuggestions([]);
		setSelectedSuggestion(null);
		setValue('');
		setActiveSuggestion(-1);
	};

	const keyUpHandler = (event: React.KeyboardEvent) => {
		switch (event.key) {
			case 'Escape':
				resetSearch();
				break;
			case 'ArrowDown':
				if (activeSuggestion < suggestions.length - 1) {
					setActiveSuggestion((prevState) => prevState + 1);
				} else {
					setActiveSuggestion(0);
				}
				break;
			case 'ArrowUp':
				if (activeSuggestion > 0) {
					setActiveSuggestion((prevState) => prevState - 1);
				} else {
					setActiveSuggestion(suggestions.length - 1);
				}
				break;
			case 'Enter':
				if (suggestions.length > 0 && activeSuggestion > -1) {
					const selected = suggestions[activeSuggestion];
					selectSuggestion(selected);
				}
		}
	};

	const selectSuggestion = (s: Suggestion): void => {
		setSelectedSuggestion(s);
		setValue(s.label);
		setSuggestions([]);
	};

	const getSuggestions = async (value: string): Promise<Suggestion[]> => {
		const suggestionsPromise = new Promise((resolve, reject) => {
			if (value.length < minChars) {
				reject([]);
			}

			timeout = setTimeout(() => {
				resolve(
					data.filter((s: Suggestion) => s.label.includes(value))
				);
			}, 1000);
		}) as Promise<Suggestion[]>;

		return suggestionsPromise;
	};

	const renderSuggestions = () => {
		return (
			<div className={'suggestions'}>
				<ul>
					{suggestions.map((suggestion) => {
						const activeSuggestionClassName =
							suggestions[activeSuggestion] &&
							suggestions[activeSuggestion].value ===
								suggestion.value
								? 'active'
								: '';
						const formattedSuggestion = suggestion.label.replace(
							value,
							`<em>${value}</em>`
						);
						return (
							<li
								key={suggestion.value}
								onClick={() => selectHandler(suggestion)}
								className={activeSuggestionClassName}>
								<span
									dangerouslySetInnerHTML={{
										__html: formattedSuggestion,
									}}></span>
							</li>
						);
					})}
				</ul>
			</div>
		);
	};

	return (
		<div className={'acf-autocomplete'} onKeyUp={keyUpHandler}>
			<label className={'search-box'}>
				<input
					type='text'
					value={value}
					onChange={changeHandler}
					placeholder='Type "Gra"'
				/>
				<div className={'indicators-wrapper'}>
					{isLoading && (
						<i
							className={
								'loading-indicator fa-solid fa-circle-notch fa-spin'
							}></i>
					)}

					{!isLoading && selectedSuggestion && (
						<i
							className={'clear-indicator fa-solid fa-times'}
							onClick={clearHandler}></i>
					)}
				</div>
			</label>

			{suggestions.length > 0 && renderSuggestions()}
		</div>
	);
};

export default Autocomplete;
