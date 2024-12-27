import { InputText } from 'primereact/inputtext'
import pythagoreanMapping from '../data/pythagoreanMapping.json';
import chaldeanMapping from '../data/chaldeanMapping.json';
import { Badge } from 'primereact/badge';
import { useEffect, useRef, useState } from "react";
import type { Schema } from "../../amplify/data/resource.ts";
import { generateClient } from "aws-amplify/data";
import { Button } from 'primereact/button';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';

const client = generateClient<Schema>();

interface CalculationResult {
    vowels: number;
    consonants: number;
    total: number;
    actual: number;
}

const Calculator = () => {
    const defaultResult: CalculationResult = {
        vowels: 0,
        consonants: 0,
        total: 0,
        actual: 0
    }
    const [name, setName] = useState<string>("");
    const [nameLength, setNameLength] = useState<number>(0);
    const [chaldeanValues, setChaldeanValues] = useState<CalculationResult>(defaultResult);
    const [pythagoreanValues, setPythagoreanValues] = useState<CalculationResult>(defaultResult);
    const [chaldeanLetterValues, setChaldeanLetterValues] = useState<string[]>([]);
    const [pythagoreanLetterValues, setPythagoreanLetterValues] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [saveDisabled, setSaveDisabled] = useState<boolean>(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const tagsRef = useRef<any>(null);

    const tags = ["Male", "Female", "School", "College", "Hospital", "Shop", "Market", "Cafe"];

    const onTagChange = (e: CheckboxChangeEvent) => {
        let updatedTags = [...selectedTags];

        if (e.checked)
            updatedTags.push(e.value);
        else
            updatedTags.splice(updatedTags.indexOf(e.value), 1);

        setSelectedTags(updatedTags);
    };

    const cellStyle = "my-1 align-items-center justify-content-center h-2rem"

    const loadMapping = (mode: string): Map<string, number> => {
        const data = mode === 'Chaldean' ? chaldeanMapping : pythagoreanMapping;
        return new Map(Object.entries(data));
    };

    const isVowel = (char: string): boolean => {
        return 'aeiou'.includes(char);
    };

    const reduceToSingleDigit = (num: number): number => {
        while (num > 9) {
            num = num
                .toString()
                .split('')
                .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        }
        return num;
    };

    const calculateNumerology = (mode: string, name: string): CalculationResult => {
        const charMap = loadMapping(mode);
        let vowels = 0;
        let consonants = 0;
        let total = 0;

        name.toLowerCase().split('').forEach((char) => {
            if (!isNaN(Number(char))) {
                total += Number(char);
            } else {
                const value = charMap.get(char);
                if (value !== undefined) {
                    if (isVowel(char)) {
                        vowels += value;
                    } else {
                        consonants += value;
                    }
                    total += value;
                }
            }
        });

        const actual = reduceToSingleDigit(total);

        return {
            vowels,
            consonants,
            total,
            actual
        };
    };

    const calculateLetterValues = (name: string) => {
        const chaldeanMap = loadMapping('Chaldean');
        const pythagoreanMap = loadMapping('Pythagorean');

        const isAlphabet = (char: string) => /^[a-zA-Z]$/.test(char); // Regex to check if the character is an alphabet

        const chaldeanValues = name.toLowerCase().split('').map((char) =>
            isAlphabet(char) ? (chaldeanMap.get(char) || '').toString() : ''
        );

        const pythagoreanValues = name.toLowerCase().split('').map((char) =>
            isAlphabet(char) ? (pythagoreanMap.get(char) || '').toString() : ''
        );

        setChaldeanLetterValues(chaldeanValues);
        setPythagoreanLetterValues(pythagoreanValues);
    };

    const countAlphanumericCharacters = (str: string) => {
        const alphanumericCharacters = str.match(/[a-zA-Z0-9]/g);
        return alphanumericCharacters ? alphanumericCharacters.length : 0;
    }

    async function saveNewName(name: string, tags: string[], pythagoreanValues: CalculationResult, chaldeanValues: CalculationResult) {
        if (!name || (name && name === '')) {
            nameRef?.current?.focus();
            return;
        }

        if (!tags || (tags && tags.length === 0)) {
            tagsRef?.current?.focus();
            return;
        }

        const input = {
            id: name,
            tags: tags,
            pythagoreanVowels: pythagoreanValues.vowels,
            pythagoreanConsonants: pythagoreanValues.consonants,
            pythagoreanTotal: pythagoreanValues.total,
            pythagoreanActual: pythagoreanValues.actual,
            chaldeanVowels: chaldeanValues.vowels,
            chaldeanConsonants: chaldeanValues.consonants,
            chaldeanTotal: chaldeanValues.total,
            chaldeanActual: chaldeanValues.actual,
        }

        const existingRecord = await client.models.Names.get({ id: name });

        if (existingRecord.data) {
            await client.models.Names.update(input);
        }
        else {
            await client.models.Names.create(input);
        }

        setName('');
        setSelectedTags([]);
    }


    useEffect(() => {
        setChaldeanValues(calculateNumerology('Chaldean', name.toLowerCase()))
        setPythagoreanValues(calculateNumerology('Pythagorean', name.toLowerCase()))
        calculateLetterValues(name)
        setNameLength(countAlphanumericCharacters(name))
    }, [name])

    return (
        <div className='flex flex-column m-2 p-2 justify-content-center shadow-3 border-round-md surface-100' >
            <label className='white-space-nowrap'>Enter name: </label>
            <div className='flex align-items-center'>
                <InputText
                    className='w-full mt-2'
                    style={{ letterSpacing: "2px" }}
                    value={name}
                    onChange={(e) => {
                        setSaveDisabled(false);
                        setName(e.target.value.toUpperCase());
                    }}
                    ref={nameRef}
                />
                <Badge
                    className='mt-2 ml-2'
                    value={nameLength}
                    size="large"
                />
            </div>
            <div className='mt-2 flex w-full p-2 border-round-md overflow-auto'>
                <div className='mx-1 justify-content-start'>
                    <div className={`${cellStyle} md:w-7rem`}> </div>
                    <div className={`${cellStyle} font-semibold hidden md:flex md:w-7rem`}>Chaldean</div>
                    <div className={`${cellStyle} font-semibold flex w-1rem md:hidden`}>C</div>
                    <div className={`${cellStyle} font-semibold hidden md:flex md:w-7rem`}>Name</div>
                    <div className={`${cellStyle} font-semibold hidden md:flex md:w-7rem`}>Pythagorean</div>
                    <div className={`${cellStyle} font-semibold flex w-1rem md:hidden`}>P</div>
                </div>
                {/* Display values of each letter of the name */}
                {name.split('').map((letter, index) => (
                    <div key={index} className='hidden md:block'>
                        <div className={`${cellStyle} w-2rem flex`}></div>
                        <div className={`${cellStyle} w-2rem flex border-0 border-round-2xl ${isVowel(letter.toLowerCase()) ? "bg-red-100" : "bg-blue-100"}`}>{chaldeanLetterValues[index]}</div>
                        <div className={`${cellStyle} w-2rem flex text-green-900 font-bold`}>{letter}</div>
                        <div className={`${cellStyle} w-2rem flex border-0 border-round-2xl ${isVowel(letter.toLowerCase()) ? "bg-red-100" : "bg-blue-100"}`}>{pythagoreanLetterValues[index]}</div>
                    </div>
                ))}
                <div className='mx-1'>
                    <div className={`${cellStyle} w-5rem flex`}>Vowels</div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-red-200`}>{chaldeanValues.vowels}</div>
                    <div className={`${cellStyle} w-5rem hidden md:flex`}></div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-red-200`}>{pythagoreanValues.vowels}</div>
                </div>
                <div className='mx-1'>
                    <div className={`${cellStyle} w-5rem flex`}>Consonants</div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-blue-200`}>{chaldeanValues.consonants}</div>
                    <div className={`${cellStyle} w-5rem hidden md:flex`}></div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-blue-200`}>{pythagoreanValues.consonants}</div>
                </div>
                <div className='mx-1 justify-content-end'>
                    <div className={`${cellStyle} w-5rem flex`}>Total</div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-green-200`}>{`${chaldeanValues.total} / ${chaldeanValues.actual}`}</div>
                    <div className={`${cellStyle} w-5rem hidden md:flex`}></div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-green-200`}>{`${pythagoreanValues.total} / ${pythagoreanValues.actual}`}</div>
                </div>
            </div>
            <div className='mt-2 flex w-full p-2 border-round-md overflow-auto block md:hidden'>
                {/* Display values of each letter of the name */}
                {name.split('').map((letter, index) => (
                    <div key={index} className='block md:hidden'>
                        <div className={`${cellStyle} w-2rem flex border-0 border-round-2xl ${isVowel(letter.toLowerCase()) ? "bg-red-100" : "bg-blue-100"}`}>{chaldeanLetterValues[index]}</div>
                        <div className={`${cellStyle} w-2rem flex text-green-900 font-bold`}>{letter}</div>
                        <div className={`${cellStyle} w-2rem flex border-0 border-round-2xl ${isVowel(letter.toLowerCase()) ? "bg-red-100" : "bg-blue-100"}`}>{pythagoreanLetterValues[index]}</div>
                    </div>
                ))}
            </div>
            <div className='mt-2 flex w-full p-2 justify-content-between align-items-center'>
                <div className="flex flex-wrap mt-2">
                    <label className='pr-2'>Tags:</label>
                    {tags.map(tag => (
                        <div key={tag} className="flex align-items-center mr-3">
                            <Checkbox
                                inputId={tag}
                                value={tag}
                                onChange={onTagChange}
                                checked={selectedTags.includes(tag)}
                            />
                            <label htmlFor={tag} className="ml-2">{tag}</label>
                        </div>
                    ))}
                </div>
                <Button
                    className='ml-2'
                    label='Save'
                    icon="pi pi-save"
                    disabled={saveDisabled}
                    onClick={() => {
                        setSaveDisabled(true);
                        saveNewName(name, selectedTags, pythagoreanValues, chaldeanValues)
                    }}
                />
            </div>
        </div>
    )
}

export default Calculator