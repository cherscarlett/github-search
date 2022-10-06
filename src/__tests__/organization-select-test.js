import React from 'react';
import {render} from 'react-dom';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event'

import OrganizationSelect from '../components/OrganizationSelect';
import OrganizationContext from '../contexts/OrganizationContext';  

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});
  
afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

describe("Organization Select", () => {
    const organization = {name: 'netflix', repositories: ['one', 'two', 'three']};
    const noop = () => {};

    const errors =  {
        notStars: 'You may only filter by a range of stars, e.g. stars:1..50',
        usedADash: 'You can search a range of stars using .., e.g. stars:1..50 or stars:50..*',
        wrongSyntax: 'You can search stars using a range, e.g. 1..50, or comparison symbols like stars:<=50 or stars:>50',
        tooManySearchTerms: 'You can only search for one organization at a time, and optionally, filter by stars, e.g. netflix stars:1..50'
      }

    it("Doesn't search for bees", () => {
        act(() => { 
            render(
                <OrganizationContext.Provider value={{organization, noop}}>
                    <OrganizationSelect />
                </OrganizationContext.Provider>, container)
            
        });

        const input = container.querySelector('input');
        const button = container.querySelector('button');
        const error = container.querySelector('span');
        act(() => {
            userEvent.type(input, 'netflix bees:1..50');
            userEvent.click(button);
        });

        if (error) expect(error.textContent).toBe(errors.notStars);
    });

    it("Informs user to use .. instead of - to search a range", () => {
        act(() => { 
            render(
                <OrganizationContext.Provider value={{organization, noop}}>
                    <OrganizationSelect />
                </OrganizationContext.Provider>, container)
            
        });

        const input = container.querySelector('input');
        const button = container.querySelector('button');
        const error = container.querySelector('span');
        act(() => {
            userEvent.type(input, 'netflix stars:1-50');
            userEvent.click(button);
        });

        if (error) expect(error.textContent).toBe(errors.usedADash);
    });

    it("Informs user they've made a general error and explains syntax", () => {
        act(() => { 
            render(
                <OrganizationContext.Provider value={{organization, noop}}>
                    <OrganizationSelect />
                </OrganizationContext.Provider>, container)
            
        });

        const input = container.querySelector('input');
        const button = container.querySelector('button');
        const error = container.querySelector('span');
        act(() => {
            userEvent.type(input, 'netflix stars:~50');
            userEvent.click(button);
        });

        if (error) expect(error.textContent).toBe(errors.wrongSyntax);
    });

    it("Informs user they can only search by one org and optionally a range of stars", () => {
        act(() => { 
            render(
                <OrganizationContext.Provider value={{organization, noop}}>
                    <OrganizationSelect />
                </OrganizationContext.Provider>, container)
            
        });

        const input = container.querySelector('input');
        const button = container.querySelector('button');
        const error = container.querySelector('span');
        act(() => {
            userEvent.type(input, 'netflix bees stars:1..50');
            userEvent.click(button);
        });

        if (error) expect(error.textContent).toBe(errors.tooManySearchTerms);
    });

  });