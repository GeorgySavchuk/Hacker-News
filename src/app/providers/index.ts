import compose from 'compose-function'
import {reduxProvider} from './reduxProvider.tsx'
import {vkProvider} from './vkProvider.tsx'

export const withProviders = compose(reduxProvider, vkProvider)