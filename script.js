const API_KEY = 'aifdNSi0gRW3Wp8E8ImrsVf682wchZJQQF64DQWj';
const APOD_URL = 'https://api.nasa.gov/planetary/apod';

const startDateInput = document.getElementById('start-date');
const getBtn = document.getElementById('get-images-btn');
const gallery = document.getElementById('gallery');
const loadingMsg = document.getElementById('loading-msg');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const factBox = document.getElementById('fact-box');

const spaceFacts = [
  'A day on Venus is longer than a year on Venus.',
    'Neutron stars can spin up to 600 times per second.',
      'There are more stars in the universe than grains of sand on every beach on Earth.',
        'The footprints left on the Moon will likely stay there for millions of years.',
          'One million Earths could fit inside the Sun.',
            'Saturn could float in water because it is mostly made of gas.',
              'Space is completely silent because sound needs a medium like air to travel.',
                'The largest known star, UY Scuti, is over 1,700 times wider than the Sun.',
                  'The Milky Way and Andromeda galaxies are on a collision course.',
                    'Astronauts grow slightly taller in microgravity.'
                    ];

                    function showRandomFact() {
                      const fact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
                        factBox.textContent = 'Did you know? ' + fact;
                        }

                        function formatDate(d) {
                          return d.toISOString().split('T')[0];
                          }

                          function setDefaultDate() {
                            const today = new Date();
                              const nineDaysAgo = new Date();
                                nineDaysAgo.setDate(today.getDate() - 8);
                                  startDateInput.max = formatDate(today);
                                    startDateInput.value = formatDate(nineDaysAgo);
                                    }

                                    async function fetchApodRange(startDateStr) {
                                      const start = new Date(startDateStr);
                                        const end = new Date(start);
                                          end.setDate(start.getDate() + 8);

                                            const today = new Date();
                                              if (end > today) {
                                                  end.setTime(today.getTime());
                                                    }

                                                      const url = APOD_URL + '?api_key=' + API_KEY +
                                                          '&start_date=' + formatDate(start) +
                                                              '&end_date=' + formatDate(end);

                                                                const response = await fetch(url);
                                                                  if (!response.ok) {
                                                                      throw new Error('NASA API request failed with status ' + response.status);
                                                                        }
                                                                          const data = await response.json();
                                                                            const items = Array.isArray(data) ? data : [data];
                                                                              return items.sort((a, b) => new Date(b.date) - new Date(a.date));
                                                                              }

                                                                              function isEmbeddableVideo(url) {
                                                                                return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
                                                                                }

                                                                                function buildVideoElement(item, isModal) {
                                                                                  const wrapper = document.createElement('div');
                                                                                    wrapper.className = 'video-thumb';

                                                                                      if (isEmbeddableVideo(item.url)) {
                                                                                          const iframe = document.createElement('iframe');
                                                                                              iframe.src = item.url;
                                                                                                  iframe.setAttribute('frameborder', '0');
                                                                                                      iframe.setAttribute('allowfullscreen', '');
                                                                                                          if (isModal) {
                                                                                                                iframe.height = '380';
                                                                                                                    }
                                                                                                                        wrapper.appendChild(iframe);
                                                                                                                          } else {
                                                                                                                              const link = document.createElement('a');
                                                                                                                                  link.href = item.url;
                                                                                                                                      link.target = '_blank';
                                                                                                                                          link.rel = 'noopener noreferrer';
                                                                                                                                              link.textContent = 'Watch Video On External Site';
                                                                                                                                                  wrapper.appendChild(link);
                                                                                                                                                    }
                                                                                                                                                    
                                                                                                                                                      return wrapper;
                                                                                                                                                      }
                                                                                                                                                      
                                                                                                                                                      function createGalleryItem(item) {
                                                                                                                                                        const card = document.createElement('div');
                                                                                                                                                          card.className = 'gallery-item';
                                                                                                                                                          
                                                                                                                                                            if (item.media_type === 'image') {
                                                                                                                                                                const img = document.createElement('img');
                                                                                                                                                                    img.src = item.url;
                                                                                                                                                                        img.alt = item.title;
                                                                                                                                                                            card.appendChild(img);
                                                                                                                                                                              } else if (item.media_type === 'video') {
                                                                                                                                                                                  card.appendChild(buildVideoElement(item, false));
                                                                                                                                                                                    }
                                                                                                                                                                                    
                                                                                                                                                                                      const title = document.createElement('h3');
                                                                                                                                                                                        title.textContent = item.title;
                                                                                                                                                                                        
                                                                                                                                                                                          const date = document.createElement('p');
                                                                                                                                                                                            date.textContent = item.date;
                                                                                                                                                                                            
                                                                                                                                                                                              card.appendChild(title);
                                                                                                                                                                                                card.appendChild(date);
                                                                                                                                                                                                
                                                                                                                                                                                                  card.addEventListener('click', () => openModal(item));
                                                                                                                                                                                                  
                                                                                                                                                                                                    return card;
                                                                                                                                                                                                    }
                                                                                                                                                                                                    
                                                                                                                                                                                                    function openModal(item) {
                                                                                                                                                                                                      modalBody.innerHTML = '';
                                                                                                                                                                                                      
                                                                                                                                                                                                        if (item.media_type === 'image') {
                                                                                                                                                                                                            const img = document.createElement('img');
                                                                                                                                                                                                                img.src = item.hdurl || item.url;
                                                                                                                                                                                                                    img.alt = item.title;
                                                                                                                                                                                                                        modalBody.appendChild(img);
                                                                                                                                                                                                                          } else if (item.media_type === 'video') {
                                                                                                                                                                                                                              modalBody.appendChild(buildVideoElement(item, true));
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                
                                                                                                                                                                                                                                  const h2 = document.createElement('h2');
                                                                                                                                                                                                                                    h2.textContent = item.title;
                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                      const dateP = document.createElement('p');
                                                                                                                                                                                                                                        dateP.className = 'modal-date';
                                                                                                                                                                                                                                          dateP.textContent = item.date;
                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                            const explanation = document.createElement('p');
                                                                                                                                                                                                                                              explanation.textContent = item.explanation;
                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                modalBody.appendChild(h2);
                                                                                                                                                                                                                                                  modalBody.appendChild(dateP);
                                                                                                                                                                                                                                                    modalBody.appendChild(explanation);
                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                      modal.classList.remove('hidden');
                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                      function closeModal() {
                                                                                                                                                                                                                                                        modal.classList.add('hidden');
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                        modalClose.addEventListener('click', closeModal);
                                                                                                                                                                                                                                                        modal.addEventListener('click', (event) => {
                                                                                                                                                                                                                                                          if (event.target === modal) {
                                                                                                                                                                                                                                                              closeModal();
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                document.addEventListener('keydown', (event) => {
                                                                                                                                                                                                                                                                  if (event.key === 'Escape') {
                                                                                                                                                                                                                                                                      closeModal();
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                        async function loadGallery() {
                                                                                                                                                                                                                                                                          const startDate = startDateInput.value;
                                                                                                                                                                                                                                                                            if (!startDate) {
                                                                                                                                                                                                                                                                                return;
                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                    gallery.innerHTML = '';
                                                                                                                                                                                                                                                                                      loadingMsg.classList.remove('hidden');
                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                        try {
                                                                                                                                                                                                                                                                                            const items = await fetchApodRange(startDate);
                                                                                                                                                                                                                                                                                                items.forEach((item) => {
                                                                                                                                                                                                                                                                                                      gallery.appendChild(createGalleryItem(item));
                                                                                                                                                                                                                                                                                                          });
                                                                                                                                                                                                                                                                                                            } catch (error) {
                                                                                                                                                                                                                                                                                                                gallery.innerHTML = '<p class="error">Something went wrong loading space photos. Please check your connection and try again.</p>';
                                                                                                                                                                                                                                                                                                                    console.error(error);
                                                                                                                                                                                                                                                                                                                      } finally {
                                                                                                                                                                                                                                                                                                                          loadingMsg.classList.add('hidden');
                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                            getBtn.addEventListener('click', loadGallery);
                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                            setDefaultDate();
                                                                                                                                                                                                                                                                                                                            showRandomFact();
                                                                                                                                                                                                                                                                                                                            loadGallery();
                                                                                                                                                                                                                                                                                                                            
