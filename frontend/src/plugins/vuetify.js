import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { pt } from 'vuetify/locale'

export default createVuetify({
  components: {
    ...components
  },
  directives,
  locale: {
    locale: 'pt',
    fallback: 'pt',
    messages: { pt },
  },
})