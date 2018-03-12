import {Injectable} from '@angular/core';

import {VersionList} from './version';
import {VERSION_LISTS} from './mock-version';

@Injectable()
export class VersionService {
    getVersionLists(): Promise<VersionList[]> {
        return Promise.resolve(VERSION_LISTS);
    }
}
