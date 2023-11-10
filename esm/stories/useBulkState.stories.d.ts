import React from 'react';
export declare const Demo: () => React.JSX.Element;
declare const meta: {
    title: string;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        initialState: {
            foo: string;
            bar: number;
            baz: boolean;
            qux: {
                quux: string;
                a: number;
                b: boolean;
                c: {
                    d: string;
                    e: number;
                    f: boolean;
                };
            };
        };
    };
};
export default meta;
