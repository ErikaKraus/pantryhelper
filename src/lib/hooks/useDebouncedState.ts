import {Dispatch, SetStateAction, useRef, useState} from 'react'

type UseDebouncedStateResult<T> = [T, Dispatch<SetStateAction<T>>, T]

/**
 * Een custom hook die bijhoudt of een er `debounceTime` milliseconden verstreken zijn sinds de laatste state update en
 * indien dit het geval is, de aangepaste waarde teruggeeft.
 *
 * @param defaultValue De standaard waarde van de state.
 * @param debounceTime Het aantal milliseconden dat gewacht wordt voordat de aangepaste waarde als derde element in de
 * result array teruggegeven wordt.
 */
const useDebouncedState = <T>(defaultValue: T, debounceTime: number = 500): UseDebouncedStateResult<T> => {
  const [value, setValue] = useState<T>(defaultValue)
  const [debouncedValue, setDebouncedValue] = useState<T>(defaultValue)

  // Een gewone variabele leeft enkel binnen de scope van een functie, via de useRef hook kunnen we een persistente
  // variabele aan maken, een variabele die doorheen verschillende oproepen van de functie beschikbaar is.
  // Gebruik useRef in de plaats van useState als de variabele geen invloed heeft op het UI.
  // De useRef hook geeft een object terug met een current property, gebruik hier geen deconstructing, dit werkt niet
  // omwille van de manier waarop useRef geïmplementeerd is.
  const timeoutId = useRef<number | null>(null)

  const timeoutFinishedHandler = (setStateAction: SetStateAction<T>) => {
    timeoutId.current = null
    setDebouncedValue(setStateAction)
  }

  const updateValue: Dispatch<SetStateAction<T>> = setStateAction => {
    // Als er al een timeout ingesteld was, moet deze geannuleerd worden.
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    setValue(setStateAction)

    // Na de debounce time kan de nieuwe waarde ingesteld worden.
    timeoutId.current = window.setTimeout(() => timeoutFinishedHandler(setStateAction), debounceTime)
  }

  return [value, updateValue, debouncedValue]
}

export default useDebouncedState
