<template>
  <section class="carousel-section">
    <div class="container">
      <h2 class="section-title">Últimas Certificações Emitidas</h2>
      <p class="section-subtitle">
        Conheça os nossos formandos que recentemente concluíram seus cursos
      </p>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando certificações...</p>
      </div>

      <!-- Carousel -->
      <div v-else-if="declaracoes.length > 0" class="carousel-container">
        <div
          class="carousel-track"
          :class="{ 'centered-cards': declaracoes.length <= cardsPerPage }"
          ref="carouselTrack"
        >
          <div
            v-for="declaracao in paginatedDeclaracoes"
            :key="declaracao.id"
            class="carousel-slide"
          >
            <div class="student-card">
              <div class="card-background"></div>

              <div class="student-photo">
                <img
                  :src="declaracao.foto"
                  :alt="declaracao.nomeCompleto"
                  @error="handleImageError"
                />
                <div class="photo-overlay">
                  <i class="bi bi-award-fill"></i>
                </div>
              </div>

              <div class="student-info">
                <h3 class="student-name">{{ declaracao.nomeCompleto }}</h3>
                <p class="student-course">{{ declaracao.curso }}</p>

                <div class="student-details">
                  <div class="detail-item">
                    <i class="bi bi-calendar3"></i>
                    <span>{{ formatDate(declaracao.dataConclusao) }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="bi bi-clock"></i>
                    <span>{{ declaracao.cargaHoraria }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="bi bi-hourglass-split"></i>
                    <span>{{ declaracao.duracao }}</span>
                  </div>
                </div>

                <div class="student-testimonial">
                  <i class="bi bi-quote quote-icon"></i>
                  <p>{{ getTestimonialText(declaracao) }}</p>
                </div>

                <div class="certificate-info">
                  <div class="certificate-code">
                    <i class="bi bi-shield-check"></i>
                    {{ declaracao.codigo }}
                  </div>
                  <button @click="emitViewDetails(declaracao)" class="btn-view-cert">
                    <i class="bi bi-eye-fill"></i>
                    Ver Certificado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="pagination-controls">
          <button
            class="pagination-arrow"
            @click="previousPage"
            :disabled="currentPage === 1"
          >
            <i class="bi bi-chevron-left"></i>
          </button>

          <div class="pagination-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              class="page-number"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="pagination-arrow"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>

        <!-- Dots for Mobile -->
        <div v-if="totalPages > 1" class="carousel-dots">
          <button
            v-for="page in totalPages"
            :key="`dot-${page}`"
            class="dot"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          ></button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <i class="bi bi-inbox"></i>
        <p>Nenhuma certificação disponível no momento</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "UltimasDeclaracoes",
  props: {
    declaracoes: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["viewDetails"],
  data() {
    return {
      loading: false,
      currentPage: 1,
      cardsPerPage: 4,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.declaracoes.length / this.cardsPerPage);
    },
    paginatedDeclaracoes() {
      const start = (this.currentPage - 1) * this.cardsPerPage;
      const end = start + this.cardsPerPage;
      return this.declaracoes.slice(start, end);
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  mounted() {
    this.updateCardsPerPage();
    window.addEventListener("resize", this.updateCardsPerPage);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateCardsPerPage);
  },
  methods: {
    emitViewDetails(declaracao) {
      console.log("🔵 Emitindo viewDetails para:", declaracao);
      this.$emit("viewDetails", declaracao);
    },
    formatDate(dateString) {
      if (!dateString) return "Data não disponível";
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    handleImageError(event) {
      event.target.src = "https://via.placeholder.com/90";
    },
    getTestimonialText(declaracao) {
      // Pega um trecho da declaração ou usa um texto padrão
      if (declaracao.declaracao && declaracao.declaracao.length > 100) {
        return declaracao.declaracao.substring(0, 100) + "...";
      } else if (declaracao.declaracao) {
        return declaracao.declaracao;
      }
      return `Concluí com sucesso o curso de ${declaracao.curso}. Foi uma experiência enriquecedora!`;
    },
    updateCardsPerPage() {
      const width = window.innerWidth;
      if (width < 768) {
        this.cardsPerPage = 1;
      } else if (width < 992) {
        this.cardsPerPage = 2;
      } else if (width < 1200) {
        this.cardsPerPage = 3;
      } else {
        this.cardsPerPage = 4;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.scrollToTop();
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.scrollToTop();
      }
    },
    goToPage(page) {
      this.currentPage = page;
      this.scrollToTop();
    },
    scrollToTop() {
      if (this.$refs.carouselTrack) {
        this.$refs.carouselTrack.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.carousel-section {
  padding: 1rem 0;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  background: transparent;
  overflow: hidden;
}

.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 15px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  font-weight: 300;
  margin-bottom: 0.6rem;
  text-align: center;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b4cb8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 60px;
  color: #dee2e6;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 18px;
  font-weight: 500;
}

.carousel-container {
  position: relative;
  width: 100%;
  margin: 0 auto;
  overflow: visible;
  min-height: 480px;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  align-items: flex-start;
  gap: 20px;
  padding: 0 10px;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-track.centered-cards {
  justify-content: center;
  gap: 20px;
}

.carousel-slide {
  flex: 0 0 calc(25% - 15px);
  box-sizing: border-box;
  max-width: 320px;
}

.student-card {
  background: rgb(255, 255, 255);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 520px;
  width: 100%;
  margin: 30px auto 0;
}

.student-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(135deg, #3b4cb8, #4e73df);
  z-index: 1;
}

.student-photo {
  position: relative;
  width: 92px;
  height: 90px;
  margin: 15px auto 15px;
  z-index: 2;
  flex-shrink: 0;
}

.student-photo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  border: 4px solid white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.photo-overlay {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #ffc107, #ffeb3b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: bold;
  border: 3px solid white;
}

.student-info {
  padding: 0 1.2rem 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.student-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0.6rem 0 0.4rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.4rem;
}

.student-course {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 1rem;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 0.30rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #495057;
}

.detail-item i {
  color: #3b4cb8;
  margin-right: 0.4rem;
  width: 14px;
}

.student-testimonial {
  background: rgba(59, 76, 184, 0.05);
  padding: 0.9rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 110px;
  flex-shrink: 0;
  justify-content: flex-start;
}

.quote-icon {
  color: #3b4cb8;
  font-size: 1.2rem;
  margin-bottom: 0.4rem;
  flex-shrink: 0;
  margin-top: 0;
  align-self: center;
}

.student-testimonial p {
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.certificate-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}

.certificate-code {
  font-size: 0.75rem;
  color: #6c757d;
  font-family: 'Courier New', monospace;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 8px;
  border-left: 3px solid #3b4cb8;
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-all;
  margin: 0;
}

.btn-view-cert {
  width: 100%;
  padding: 0.8rem 1.2rem;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn-view-cert:hover {
  background: linear-gradient(135deg, #218838, #1abc9c);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 1rem;
  padding: 0.4rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.pagination-arrow {
  min-width: 40px;
  height: 40px;
  background: transparent;
  color: #6c757d;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
}

.pagination-arrow:hover:not(:disabled) {
  background: #f1f3f5;
  color: #495057;
}

.pagination-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  gap: 0.20rem;
}

.page-number {
  min-width: 40px;
  height: 40px;
  padding: 0 0.5rem;
  background: transparent;
  color: #495057;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  font-weight: 500;
}

.page-number:hover:not(.active) {
  background: #f1f3f5;
}

.page-number.active {
  background: #5469d4;
  color: white;
  font-weight: 600;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  width: 100%;
}

.dot {
  width: 12px;
  height: 12px;
  border: none;
  background: #dee2e6;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.dot.active {
  background: linear-gradient(135deg, #3b4cb8, #4e73df);
  transform: scale(1.1);
}

@media (max-width: 1200px) {
  .carousel-slide {
    flex: 0 0 calc(33.333% - 15px);
  }
}

@media (max-width: 992px) {
  .carousel-slide {
    flex: 0 0 calc(50% - 15px);
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .carousel-section {
    padding: 1rem 0;
    overflow: visible;
    background: transparent;
  }

  .section-title {
    font-size: 1.8rem;
    margin-bottom: 0.4rem;
  }

  .section-subtitle {
    font-size: 1rem;
    margin-bottom: 0.6rem;
  }

  .carousel-container {
    padding: 0;
    overflow: visible;
    min-height: auto;
    margin-top: 0;
    display: contents;
  }

  .carousel-track {
    overflow-x: auto;
    overflow-y: visible;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    gap: 15px;
    padding: 0 15px 20px 15px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .carousel-track::-webkit-scrollbar {
    display: none;
  }

  .carousel-slide {
    flex: 0 0 280px;
    padding: 0;
    scroll-snap-align: center;
  }

  .student-card {
    height: 450px;
    min-height: 450px;
    max-height: 450px;
    border-radius: 16px;
    margin: 40px 0 0;
    max-width: 100%;
  }

  .card-background {
    height: 90px;
  }

  .student-photo {
    width: 70px;
    height: 70px;
    margin: 10px auto 10px;
  }

  .photo-overlay {
    width: 24px;
    height: 24px;
    font-size: 0.8rem;
  }

  .student-info {
    padding: 0 0.8rem 0.8rem;
  }

  .student-name {
    font-size: 0.9rem;
    min-height: 2.2rem;
    max-height: 2.2rem;
    line-height: 1.2;
    margin: 0.4rem 0 0.3rem;
  }

  .student-course {
    font-size: 0.8rem;
    min-height: 2rem;
    max-height: 2rem;
    margin-bottom: 0.6rem;
  }

  .student-details {
    gap: 0.2rem;
    margin-bottom: 0.6rem;
  }

  .detail-item {
    font-size: 0.7rem;
  }

  .student-testimonial {
    height: 85px;
    min-height: 85px;
    max-height: 85px;
    overflow: hidden;
    padding: 0.6rem;
    margin-bottom: 0.6rem;
    justify-content: flex-start;
  }

  .quote-icon {
    font-size: 1rem;
    margin-bottom: 0.3rem;
    align-self: center;
  }

  .student-testimonial p {
    -webkit-line-clamp: 3;
    font-size: 0.75rem;
    line-height: 1.3;
  }

  .certificate-code {
    font-size: 0.65rem;
    padding: 0.4rem;
    margin-bottom: 0.4rem;
  }

  .btn-view-cert {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }

  .certificate-info {
    margin-top: auto;
    gap: 0.4rem;
  }

  .pagination-controls {
    display: none;
  }
}

@media (max-width: 576px) {
  .carousel-track {
    padding: 0 10px 15px 10px;
  }

  .carousel-slide {
    flex: 0 0 250px;
  }

  .student-card {
    height: 430px;
    min-height: 430px;
    max-height: 430px;
  }

  .section-title {
    font-size: 1.6rem;
  }

  .section-subtitle {
    font-size: 0.9rem;
  }

  .student-photo {
    width: 60px;
    height: 60px;
    margin: 10px auto 8px;
  }

  .photo-overlay {
    width: 20px;
    height: 20px;
    font-size: 0.7rem;
  }

  .student-info {
    padding: 0 0.6rem 0.6rem;
  }

  .student-name {
    font-size: 0.85rem;
    min-height: 2rem;
    max-height: 2rem;
    margin-top: 0.4rem;
  }

  .student-course {
    font-size: 0.72rem;
    margin-bottom: 0.5rem;
    min-height: 1.8rem;
    max-height: 1.8rem;
  }

  .detail-item {
    font-size: 0.65rem;
    margin-bottom: 0.15rem;
  }

  .student-testimonial {
    min-height: 75px;
    max-height: 75px;
    height: 75px;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    justify-content: flex-start;
  }

  .student-testimonial p {
    -webkit-line-clamp: 3;
    font-size: 0.7rem;
    line-height: 1.25;
  }

  .certificate-code {
    font-size: 0.6rem;
    padding: 0.3rem;
  }

  .btn-view-cert {
    padding: 0.5rem 0.7rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 375px) {
  .carousel-track {
    padding: 0 10px 20px 10px;
  }

  .carousel-slide {
    flex: 0 0 240px;
  }

  .student-card {
    height: 420px;
    min-height: 420px;
    max-height: 420px;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-subtitle {
    font-size: 0.85rem;
  }

  .card-background {
    height: 80px;
  }

  .student-photo {
    width: 55px;
    height: 55px;
    margin: 8px auto 8px;
  }

  .photo-overlay {
    width: 18px;
    height: 18px;
    font-size: 0.65rem;
    bottom: -2px;
    right: -2px;
    border-width: 2px;
  }

  .student-info {
    padding: 0 0.5rem 0.5rem;
  }

  .student-name {
    font-size: 0.8rem;
    min-height: 1.8rem;
    max-height: 1.8rem;
    margin-top: 0.8rem;
  }

  .student-course {
    font-size: 0.68rem;
    min-height: 1.6rem;
    max-height: 1.6rem;
    margin-bottom: 0.5rem;
  }

  .student-details {
    gap: 0.2rem;
    margin-bottom: 0.5rem;
  }

  .detail-item {
    font-size: 0.62rem;
  }

  .detail-item i {
    width: 11px;
    margin-right: 0.25rem;
  }

  .student-testimonial {
    padding: 0.5rem;
    min-height: 70px;
    max-height: 70px;
    height: 70px;
    margin-bottom: 0.5rem;
    justify-content: flex-start;
  }

  .quote-icon {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    align-self: center;
  }

  .student-testimonial p {
    font-size: 0.65rem;
    line-height: 1.3;
    -webkit-line-clamp: 3;
  }

  .certificate-info {
    gap: 0.4rem;
    margin-top: auto;
  }

  .certificate-code {
    font-size: 0.58rem;
    padding: 0.3rem;
  }

  .btn-view-cert {
    padding: 0.45rem 0.6rem;
    font-size: 0.7rem;
    gap: 0.25rem;
  }

  .carousel-dots {
    margin-top: 1.5rem;
  }

  .dot {
    width: 10px;
    height: 10px;
  }
}

.carousel-track.centered-cards {
  justify-content: center !important;
  gap: 20px !important;
}

.carousel-track.centered-cards .carousel-slide {
  flex: 0 0 calc(25% - 15px) !important;
  max-width: 320px !important;
}

@media (min-width: 769px) {
  .carousel-dots {
    display: none;
  }
}
</style>