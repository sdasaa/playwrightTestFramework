import {uiPomFix} from '../ui/ui.fixture'
import {apiFlowFix} from '../api/api.flow.fixture'
import {preAuthorizedContextsFix} from '../api/api.auth.fixture'
import {apiClientsFix} from '../api/api.clients.fixture'
import {networkMockFix} from '../mocking/nw.mock.fixture'

import { mergeTests } from '@playwright/test'

export const allCombinedFix = mergeTests(uiPomFix, apiFlowFix, preAuthorizedContextsFix, apiClientsFix, networkMockFix);
