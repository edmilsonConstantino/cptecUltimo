<template>
  <section class="carousel-section">
    <!-- Título, Subtítulo e Cards no MESMO container -->
    <div class="full-width-container">
      <h2 class="section-title">Certificações Recentes</h2>
      <p class="section-subtitle">Profissionais certificados</p>

     <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando...</p>
      </div>   <!-- Loading -->
    

      <!-- Carousel -->
      <div v-else-if="declaracoes.length > 0" class="carousel-wrapper">
        <transition-group name="slide-fade" tag="div" class="carousel-track" ref="carouselTrack">
          <div
            v-for="declaracao in paginatedDeclaracoes"
            :key="declaracao.id"
            class="carousel-slide"
          >
            <!-- Card Vertical com Design Moderno -->
            <div class="cert-card">
              <!-- Topo com linha decorativa -->
              <div class="card-top-line"></div>

              <!-- Foto sem background -->
              <div class="photo-wrapper">
                <img
                  :src="declaracao.foto"
                  :alt="declaracao.nomeCompleto"
                  @error="handleImageError"
                />
                <div class="check-badge">
                  <i class="bi bi-patch-check-fill"></i>
                </div>
              </div>

              <!-- Conteúdo -->
              <div class="card-content">
                <h3 class="student-name">{{ declaracao.nomeCompleto }}</h3>
                
                <div class="course-badge">
                  <i class="bi bi-mortarboard-fill"></i>
                  <span>{{ declaracao.curso }}</span>
                </div>

                <div class="info-grid">
                  <div class="info-box">
                    <i class="bi bi-calendar-check"></i>
                    <div class="info-text">
                      <span class="info-label">Conclusão</span>
                      <span class="info-value">{{ formatDate(declaracao.dataConclusao) }}</span>
                    </div>
                  </div>
                </div>

                <div class="divider"></div>

                <button @click="emitViewDetails(declaracao)" class="cert-button">
                  <span>Visualizar Certificado</span>
                  <i class="bi bi-arrow-right-circle-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </transition-group>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button class="nav-btn" @click="previousPage">
            <i class="bi bi-chevron-left"></i>
          </button>

          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              class="page-btn"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button class="nav-btn" @click="nextPage">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="empty-state">
        <i class="bi bi-folder2-open"></i>
        <p>Sem certificações disponíveis</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "UltimasDeclaracoes",
  props: {
    declaracoes: { type: Array, default: () => [] },
  },
  emits: ["viewDetails"],
  data() {
    return {
      loading: false,
      currentPage: 1,
      cardsPerPage: 4,
      autoPlayInterval: null,
      isTransitioning: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.declaracoes.length / this.cardsPerPage);
    },
    paginatedDeclaracoes() {
      const start = (this.currentPage - 1) * this.cardsPerPage;
      return this.declaracoes.slice(start, start + this.cardsPerPage);
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    },
  },
  mounted() {
    if (this.declaracoes.length > 0) {
      console.log('📸 Fotos recebidas:', this.declaracoes.map(d => ({
        nome: d.nomeCompleto,
        foto: d.foto
      })));
    }
    
    this.updateCardsPerPage();
    window.addEventListener("resize", this.updateCardsPerPage);
    this.$nextTick(() => {
      this.startAutoPlay();
    });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateCardsPerPage);
    this.stopAutoPlay();
  },
  methods: {
    emitViewDetails(declaracao) {
      this.$emit("viewDetails", declaracao);
    },
    formatDate(dateString) {
      if (!dateString) return "---";
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
    handleImageError(event) {
      console.log('❌ Erro ao carregar imagem:', event.target.src);
      const declaracao = this.declaracoes.find(d => d.foto === event.target.src);
      if (declaracao) {
        event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(declaracao.nomeCompleto)}&background=3b82f6&color=fff&size=200`;
      } else {
        event.target.src = "https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff&size=200";
      }
    },
    updateCardsPerPage() {
      const width = window.innerWidth;
      this.cardsPerPage = width < 640 ? 1 : width < 1024 ? 2 : width < 1280 ? 3 : 4;
      
      this.stopAutoPlay();
      if (width < 768 && this.totalPages > 1) {
        this.startAutoPlay();
      }
    },
    nextPage() {
      if (this.isTransitioning) return;
      
      this.isTransitioning = true;
      
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      } else if (window.innerWidth < 768) {
        this.currentPage = 1;
      }
      
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    },
    previousPage() {
      if (this.isTransitioning) return;
      
      this.isTransitioning = true;
      
      if (this.currentPage > 1) {
        this.currentPage--;
      } else if (window.innerWidth < 768) {
        this.currentPage = this.totalPages;
      }
      
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    },
    goToPage(page) {
      if (this.isTransitioning || page === this.currentPage) return;
      
      this.isTransitioning = true;
      this.currentPage = page;
      
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    },
    startAutoPlay() {
      const width = window.innerWidth;
      if (width < 768 && this.declaracoes.length > 1) {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
          this.nextPage();
        }, 4000);
      }
    },
    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.carousel-section {
  padding: 50px 0 40px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%);
  position: relative;
  overflow: hidden;
}

@media (max-width: 768px) {
  .carousel-section {
    padding: 30px 0 20px;
  }
}

.carousel-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
}

.carousel-section::after {
  content: '';
  position: absolute;
  bottom: -50px;
  right: -80px;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(30, 58, 138, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -20px); }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

/* Novo container full-width para título e cards juntos */
.full-width-container {
  width: 100%;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -1px;
  position: relative;
  display: inline-block;
  width: 100%;
  animation: slideDown 0.8s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title::before {
  content: '🎓';
  position: absolute;
  left: 50%;
  top: -38px;
  transform: translateX(-50%);
  font-size: 1.8rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-10px); }
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #3b82f6, #60a5fa, transparent);
  border-radius: 2px;
  animation: expandLine 1s ease-out;
}

@keyframes expandLine {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 120px;
    opacity: 1;
  }
}

.section-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 500;
  position: relative;
  animation: fadeIn 1s ease-out 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.section-subtitle::before,
.section-subtitle::after {
  content: '✦';
  color: #3b82f6;
  margin: 0 12px;
  font-size: 0.8rem;
  opacity: 0.6;
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e7ff;
  border-top-color: #1e3a8a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-state i {
  font-size: 60px;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* Carousel Wrapper */
.carousel-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 8px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  
}

/* No mobile, forçar posição absoluta para permitir slide horizontal */
@media (max-width: 768px) {
  .carousel-track {
    flex-wrap: nowrap;
    overflow: hidden;
    height: auto;
    min-height: 480px;
    padding: 0;
    margin-bottom: 10px;
  }
  
  .carousel-slide {
    position: absolute;
    left: 0;
    right: 0;
    width: 90% !important;
    max-width: 90% !important;
    margin: 0 auto;
  }
}

/* Transição suave para os cards */
.slide-fade-enter-active {
  animation: slideInDesktop 0.5s ease-out;
}

.slide-fade-leave-active {
  animation: slideOutDesktop 0.4s ease-in;
}

@keyframes slideInDesktop {
  from {
    opacity: 0;
    transform: translateX(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slideOutDesktop {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-50px) scale(0.95);
  }
}

/* Animações específicas para mobile - slide horizontal */
@media (max-width: 768px) {
  .slide-fade-enter-active {
    animation: slideInMobile 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-fade-leave-active {
    animation: slideOutMobile 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideInMobile {
    from {
      opacity: 0;
      transform: translateX(100%) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes slideOutMobile {
    from {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateX(-100%) scale(0.9);
    }
  }
}

.carousel-slide {
  flex: 0 0 auto;
  width: 100%;
  max-width: 280px;
}

/* Quando há muitos cards (mais de 3), alinhar à esquerda */
.carousel-track:has(.carousel-slide:nth-child(4)) {
  justify-content: flex-start;
}

@media (min-width: 640px) {
  .carousel-slide {
    max-width: 280px;
  }
}

@media (min-width: 1024px) {
  .carousel-slide {
    max-width: 280px;
  }
}

@media (min-width: 1280px) {
  .carousel-slide {
    max-width: 280px;
  }
}

.carousel-slide {
  display: flex;
}

/* Card - Design Vertical Compacto */
.cert-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 3px 16px rgba(30, 58, 138, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid #e2e8f0;
  width: 100%;
}

@media (max-width: 768px) {
  .cert-card {
    margin-bottom: 0;
  }
}

.cert-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
  border-color: #3b82f6;
}

/* Linha decorativa no topo */
.card-top-line {
  height: 4px;
  background: linear-gradient(90deg, #1e3a8a, #3b82f6, #60a5fa);
}

/* Foto */
.photo-wrapper {
  padding: 20px 20px 0;
  display: flex;
  justify-content: center;
  position: relative;
}

.photo-wrapper img {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e0e7ff;
  box-shadow: 0 6px 20px rgba(30, 58, 138, 0.15);
  transition: all 0.3s ease;
}

.cert-card:hover .photo-wrapper img {
  border-color: #3b82f6;
  transform: scale(1.05);
}

.check-badge {
  position: absolute;
  bottom: -5px;
  right: 35%;
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.check-badge i {
  font-size: 18px;
  color: #3b82f6;
}

/* Conteúdo */
.card-content {
  padding: 18px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.student-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  line-height: 1.3;
  min-height: 2.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

/* Badge do curso */
.course-badge {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
  padding: 8px 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.course-badge i {
  color: #1e3a8a;
  font-size: 0.95rem;
}

.course-badge span {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e3a8a;
  text-align: center;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

/* Info Grid */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

.info-box i {
  color: #3b82f6;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
}

/* Divider */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin: 4px 0;
}

/* Botão */
.cert-button {
  width: 100%;
  padding: 11px 16px;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 14px rgba(30, 58, 138, 0.25);
  margin-top: auto;
}

.cert-button:hover {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 58, 138, 0.35);
}

.cert-button i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.cert-button:hover i {
  transform: translateX(4px);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 50px;
}

.nav-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  font-size: 1rem;
}

.nav-btn:hover:not(:disabled) {
  background: #1e3a8a;
  border-color: #1e3a8a;
  color: white;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  font-weight: 600;
  font-size: 0.85rem;
}

.page-btn:hover:not(.active) {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #1e3a8a;
}

.page-btn.active {
  background: #1e3a8a;
  border-color: #1e3a8a;
  color: white;
  box-shadow: 0 3px 10px rgba(30, 58, 138, 0.2);
}

/* Mobile - Apenas Setas */
@media (max-width: 768px) {
  .page-numbers {
    display: none;
  }

  .pagination {
    gap: 20px;
    margin-top: 25px;
  }

  .nav-btn {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .section-title {
    font-size: 1.8rem;
  }

  .carousel-track {
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .carousel-section {
    padding: 35px 0 20px;
  }

  .section-title {
    font-size: 1.6rem;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .section-title::before {
    font-size: 1.3rem;
    top: -30px;
  }

  .section-title::after {
    width: 80px;
    height: 3px;
    bottom: -4px;
  }

  .section-subtitle {
    font-size: 0.85rem;
    margin-bottom: 20px;
  }

  .section-subtitle::before,
  .section-subtitle::after {
    margin: 0 8px;
    font-size: 0.7rem;
  }

  .carousel-track {
    gap: 16px;
  }

  .carousel-slide {
    max-width: 90%;
    margin: 0 auto;
  }

  .cert-card {
    border-radius: 16px;
  }

  .photo-wrapper {
    padding: 18px 18px 0;
  }

  .photo-wrapper img {
    width: 75px;
    height: 75px;
  }

  .check-badge {
    width: 28px;
    height: 28px;
  }

  .check-badge i {
    font-size: 16px;
  }

  .card-content {
    padding: 16px 16px 18px;
    gap: 10px;
  }

  .student-name {
    font-size: 0.9rem;
  }

  .course-badge {
    padding: 7px 11px;
  }

  .course-badge span {
    font-size: 0.7rem;
  }

  .info-box {
    padding: 7px 10px;
  }

  .info-box i {
    font-size: 1rem;
  }

  .cert-button {
    padding: 10px 14px;
    font-size: 0.75rem;
  }

  .pagination {
    margin-top: -110px;
    gap: 8px;
  }

  .nav-btn,
  .page-btn {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .carousel-section {
    padding: 45px 0 35px;
  }

  .section-title {
    font-size: 1.6rem;
  }

  .section-title::before {
    font-size: 1.4rem;
    top: -35px;
  }

  .section-title::after {
    width: 70px;
    height: 3px;
  }

  .section-subtitle {
    font-size: 0.88rem;
  }

  .section-subtitle::before,
  .section-subtitle::after {
    margin: 0 6px;
  }

  .photo-wrapper img {
    width: 70px;
    height: 70px;
  }

  .student-name {
    font-size: 0.85rem;
  }

  .course-badge span {
    font-size: 0.68rem;
  }

  .info-value {
    font-size: 0.75rem;
  }
}
</style>