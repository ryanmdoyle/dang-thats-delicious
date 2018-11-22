import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map'

autocomplete( $('#address'), $('#lat'), $('#lng') );

// selects the .search input and runs the typeAhead function
typeAhead( $('.search') );

makeMap( $('#map') );