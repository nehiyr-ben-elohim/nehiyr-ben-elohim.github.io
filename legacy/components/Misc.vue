<template>
  <section class="row misc-row" :id="path.resolve.split('#').join('')">
    <CurrentStep :append="currentStep"></CurrentStep>

    <div class="row-inner">
      <ul class="misc-list">
        <li 
          v-for="_ in miscs"
          class="misc-item" 
          :class="_.categ">
          <div class="misc-presentator">
            <header class="misc-categ-wrapper">
              <h1 class="misc-categ-name">{{ _.name }}</h1>
              <p class="misc-categ-entries">
                <a 
                  v-for="__ in _.entries"
                  class="misc-categ-item" 
                  target="_blank" 
                  :href="`${__.dataURL}`">{{ __.name }}</a>
              </p>
            </header>
          </div>

          <div class="misc-scene">
            <ul class="misc-scenes-list">
              <li v-for="__ in _.scenes" class="misc-scene-item" v-bind:style="__.style">
                <a 
                  :href="`${__.dataURL}`" 
                  target="_blank" 
                  class="misc-scene-item-link"></a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import { PATHS } from '@@/illuminate/config'
  import CurrentStep from '@/components/CurrentStep'
  
  export default {
    name: 'Misc',

    // Required components
    components: { CurrentStep },

    // data
    data: () => ({
      // currentStep
      currentStep: {
        text: 'Misc'
      },

      // miscs
      miscs: [
        {
          name: 'Fav. musics',
          categ: 'misc-musics',
          scenes: [
            {
              dataURL: 'https://www.youtube.com/watch?v=uZs1AHQBz24?ref=jeanjacquesakakpo',
              style: {
                backgroundImage: 'url(\'img/misc/music_1.jpg\')'
              }
            },
            {
              dataURL: 'https://www.youtube.com/watch?v=Az-mGR-CehY?ref=jeanjacquesakakpo',
              style: {
                backgroundImage: 'url(\'img/misc/music_2.jpg\')'
              }
            },
            {
              dataURL: 'https://www.youtube.com/watch?v=YgBynbRGv74?ref=jeanjacquesakakpo',
              style: {
                backgroundImage: 'url(\'img/misc/music_3.jpg\')'
              }
            }
          ],
          entries: [
            {
              name: 'Pop Rock EDM',
              dataURL: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g&list=PL4Lg518fIN6DALbd1uoewp-59sHd3jH1A'
            },
            {
              name: 'RAP FR',
              dataURL: 'https://www.youtube.com/watch?v=-KRe61NpaTA&list=PL4Lg518fIN6Dqi_chZRlVocZFNM6obT9o'
            }
          ]
        },
        {
          name: 'Fav. games',
          categ: 'misc-game',
          scenes: [
            {
              dataURL: 'https://ghost-recon.ubisoft.com/wildlands/fr-fr/home/index.aspx',
              style: {
                backgroundImage: 'url(\'img/misc/gaming_1.jpg\')'
              }
            },
            {
              dataURL: 'https://www.konami.com/wepes/2018/eu/fr/',
              style: {
                backgroundImage: 'url(\'img/misc/gaming_2.jpg\')'
              }
            },
            {
              dataURL: 'https://www.rockstargames.com/V/fr/videos/video/11002',
              style: {
                backgroundImage: 'url(\'img/misc/gaming_3.jpg\')'
              }
            }
          ],
          entries: [
            {
              name: 'FPS',
              dataURL: 'https://store.steampowered.com/tags/fr/Action/'
            },
            {
              name: 'Foot',
              dataURL: 'https://store.steampowered.com/tags/fr/Sport/'
            },
            {
              name: 'Open World',
              dataURL: 'https://store.steampowered.com/tags/fr/Aventure/'
            }
          ]
        },
        {
          name: 'Fav. movies',
          categ: 'misc-videos',
          scenes: [
            {
              dataURL: 'http://www.allocine.fr/series/ficheserie-11701/saison-31768/',
              style: {
                backgroundImage: 'url(\'img/misc/movies_1.jpg\')'
              }
            },
            {
              dataURL: 'https://www.netflix.com/fr/title/70196145',
              style: {
                backgroundImage: 'url(\'img/misc/movies_2.jpg\')'
              }
            },
            {
              dataURL: 'http://www.allocine.fr/series/ficheserie-20225/saison-28598/',
              style: {
                backgroundImage: 'url(\'img/misc/movies_3.jpg\')'
              }
            }
          ],
          entries: [
            {
              name: 'High-tech',
              dataURL: 'http://www.allocine.fr/series/ficheserie_gen_cserie=3247.html'
            },
            {
              name: 'Comedy',
              dataURL: 'http://www.allocine.fr/series-tv/genre-13005/'
            }
          ]
        },
        {
          name: 'Fav. places',
          categ: 'misc-places-tobe',
          scenes: [
            {
              dataURL: 'https://www.google.com/search?q=san+fransisco',
              style: {
                backgroundImage: 'url(\'img/misc/places_1.jpg\')'
              }
            },
            {
              dataURL: 'https://www.google.com/search?q=miami+beach',
              style: {
                backgroundImage: 'url(\'img/misc/places_2.jpg\')'
              }
            },
            {
              dataURL: 'https://www.google.com/search?q=montreal',
              style: {
                backgroundImage: 'url(\'img/misc/places_3.jpg\')'
              }
            }
          ],
          entries: [
            {
              name: 'SFO',
              dataURL: 'https://www.google.com/search?q=san+fransisco'
            },
            {
              name: 'MIA',
              dataURL: 'https://www.google.com/search?q=miami+beach'
            },
            {
              name: 'YMQ',
              dataURL: 'https://www.google.com/search?q=montreal'
            }
          ]
        }
      ],

      // My path
      path: PATHS.MISC,
    }),

    // methods
    methods: {},
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/components/misc.scss';
</style>
