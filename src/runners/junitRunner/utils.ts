// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

const primitiveTypeDescriptors: Map<string, string> = new Map([
    ['B', 'byte'],
    ['C', 'char'],
    ['D', 'double'],
    ['F', 'float'],
    ['I', 'int'],
    ['J', 'long'],
    ['S', 'short'],
    ['Z', 'boolean'],
]);

export function getJUnit5ParameterName(rawParameterName: string): string {
    const arrayDescriptor: RegExpExecArray | null = /^(\[+)(?:L(.+);|([BCDFIJSZ]))$/.exec(rawParameterName);
    if (!arrayDescriptor) {
        return getSimpleTypeName(rawParameterName);
    }

    const componentType: string = arrayDescriptor[2] || primitiveTypeDescriptors.get(arrayDescriptor[3])!;
    return `${getSimpleTypeName(componentType)}${'[]'.repeat(arrayDescriptor[1].length)}`;
}

export function getJUnit5MethodName(rawName: string): string {
    const rawParamsString: string = rawName.substring(rawName.indexOf('(') + 1, rawName.indexOf(')'))
        .replace(/\\,/g, ',')
        .replace(/ /g, '');
    const paramString: string = rawParamsString.split(',').map(getJUnit5ParameterName).join(', ');
    const methodName: string = rawName.substring(0, rawName.indexOf('('));
    return `${methodName}(${paramString})`;
}

export function unwrapJUnit5TestPart(part: string): string {
    return part.trim().replace(/^\[/, '').replace(/\]$/, '');
}

function getSimpleTypeName(typeName: string): string {
    const canonicalName: string = typeName.replace(/\//g, '.').replace(/\$/g, '.');
    return canonicalName.substring(canonicalName.lastIndexOf('.') + 1);
}
