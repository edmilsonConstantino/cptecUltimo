<template>
  <div>
    <section class="search-section" ref="searchSection">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="section-title">Buscar Declaração</h2>
            <p class="section-subtitle">
              Encontre sua declaração pelo nome, curso ou código de verificação
            </p>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="search-box">
              <div class="search-main">
                <div class="search-input-group">
                  <div class="input-icon">
                    <i class="bi bi-search"></i>
                  </div>
                  <input
                    type="text"
                    v-model="searchQuery"
                    @input="filterDeclaracoes"
                    class="form-control search-input"
                    placeholder="Digite o nome do aluno, curso ou código da declaração..."
                  />
                  <button @click="clearSearch" class="clear-btn" v-if="searchQuery">
                    <i class="bi bi-x"></i>
                  </button>

                  <!-- nova seta dentro do campo -->
                  <button type="button" class="search-submit" @click="submitSearch" aria-label="Buscar">
                    <i class="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
              <div class="search-filters">
                <div class="filter-group">
                  <label>Curso:</label>
                  <select v-model="selectedCourse" @change="filterDeclaracoes" class="form-select">
                    <option value="">Todos os Cursos</option>
                    <option v-for="curso in cursos" :key="curso" :value="curso">{{ curso }}</option>
                  </select>
                </div>
                <div class="filter-group">
                  <label>Ano:</label>
                  <select v-model="selectedYear" @change="filterDeclaracoes" class="form-select">
                    <option value="">Todos os Anos</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
                <div class="filter-group">
                  <label>Status:</label>
                  <select v-model="selectedStatus" @change="filterDeclaracoes" class="form-select">
                    <option value="">Todos</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="results-section" v-if="searchQuery || selectedCourse || selectedYear || selectedStatus">
      <div class="container">
        <div class="row mb-4">
          <div class="col-12">
            <div class="results-header">
              <h3>
                <template v-if="!searchQuery && !selectedCourse && !selectedYear && !selectedStatus">
                  Pesquise para encontrar sua declaração
                </template>
                <template v-else>
                  {{ filteredDeclaracoes.length > 0
                    ? `${filteredDeclaracoes.length} declaração(ões) encontrada(s)`
                    : 'Nenhuma declaração encontrada' }}
                </template>
              </h3>
              <div class="view-options" v-if="searchQuery || selectedCourse || selectedYear || selectedStatus">
                <div class="view-toggle">
                  <button
                    @click="viewMode = 'grid'"
                    class="view-btn"
                    :class="{ active: viewMode === 'grid' }"
                  >
                    <i class="bi bi-grid-3x3-gap"></i>
                    <span>Grade</span>
                  </button>
                  <button
                    @click="viewMode = 'list'"
                    class="view-btn"
                    :class="{ active: viewMode === 'list' }"
                  >
                    <i class="bi bi-list"></i>
                    <span>Lista</span>
                  </button>
                </div>
                <div class="sort-options">
                  <select v-model="sortBy" @change="sortDeclaracoes" class="form-select">
                    <option value="nome">Ordenar por Nome</option>
                    <option value="data">Ordenar por Data</option>
                    <option value="curso">Ordenar por Curso</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- GRID VIEW -->
        <div v-if="viewMode === 'grid' && filteredDeclaracoes.length > 0" class="row">
          <div
            v-for="declaracao in paginatedDeclaracoes"
            :key="declaracao.id"
            class="col-lg-4 col-md-6 mb-4"
          >
            <div class="declaracao-card" @click="viewDeclaracao(declaracao)">
              <div class="card-image">
                <img :src="declaracao.foto" :alt="declaracao.nomeCompleto" />
                <div class="card-badge">
                  <i class="bi bi-patch-check-fill"></i>
                </div>
              </div>
              <div class="card-content">
                <h5 class="student-name-card">{{ declaracao.nomeCompleto }}</h5>
                <p class="course-name">{{ declaracao.curso }}</p>
                <div class="card-details">
                  <div class="detail-row">
                    <i class="bi bi-calendar"></i>
                    <span>{{ formatDate(declaracao.dataConclusao) }}</span>
                  </div>
                  <div class="detail-row">
                    <i class="bi bi-clock"></i>
                    <span>{{ declaracao.cargaHoraria }}</span>
                  </div>
                  <div class="detail-row">
                    <i class="bi bi-award"></i>
                    <span>{{ declaracao.status || 'Aprovado' }}</span>
                  </div>
                </div>
                <div class="testimonial-preview">
                  <i class="bi bi-quote"></i>
                  <p>{{ declaracao.depoimento.substring(0, 80) }}...</p>
                </div>
                <div class="card-footer">
                  <div class="certificate-code-small">
                    {{ declaracao.codigo }}
                  </div>
                  <button @click="$emit('viewDetails', declaracao)" class="btn-view-small">
                    <i class="bi bi-eye"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- LIST VIEW -->
        <div v-else-if="viewMode === 'list' && filteredDeclaracoes.length > 0" class="declarations-list">
          <div
            v-for="declaracao in paginatedDeclaracoes"
            :key="declaracao.id"
            class="list-item"
            @click="viewDeclaracao(declaracao)"
          >
            <div class="list-photo">
              <img :src="declaracao.foto" :alt="declaracao.nomeCompleto" />
              <div class="status-badge">
                <i class="bi bi-check-circle-fill"></i>
              </div>
            </div>
            <div class="list-content">
              <div class="list-main">
                <h5 class="list-name">{{ declaracao.nomeCompleto }}</h5>
                <p class="list-course">{{ declaracao.curso }}</p>
                <div class="list-testimonial">
                  <i class="bi bi-quote"></i>
                  <span>{{ declaracao.depoimento.substring(0, 120) }}...</span>
                </div>
              </div>
              <div class="list-details">
                <div class="list-detail-item">
                  <span class="label">Data:</span>
                  <span class="value">{{ formatDate(declaracao.dataConclusao) }}</span>
                </div>
                <div class="list-detail-item">
                  <span class="label">Carga:</span>
                  <span class="value">{{ declaracao.cargaHoraria }}</span>
                </div>
                <div class="list-detail-item">
                  <span class="label">Código:</span>
                  <span class="value">{{ declaracao.codigo }}</span>
                </div>
              </div>
            </div>
            <div class="list-action">
              <button class="btn-view-list">
                <i class="bi bi-eye"></i>
                <span>Ver Declaração</span>
              </button>
            </div>
          </div>
        </div>

        <!-- PAGINAÇÃO -->
        <div class="row" v-if="totalPages > 1 && filteredDeclaracoes.length > 0">
          <div class="col-12">
            <nav class="pagination-nav">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button @click="changePage(currentPage - 1)" class="page-link">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>
                <li
                  v-for="page in visiblePages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <button @click="changePage(page)" class="page-link">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button @click="changePage(currentPage + 1)" class="page-link">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
import CertificationsService from "@/components/services/certifications.js";

export default {
  emits: ["viewDetails"],
  name: "BuscaDeclaracoes",
  data() {
    return {
      declaracoes: [],
      loading: true,
      error: null,
      searchQuery: "",
      selectedCourse: "",
      selectedYear: "",
      selectedStatus: "",
      sortBy: "nome",
      viewMode: "grid",
      currentPage: 1,
      itemsPerPage: 6
    };
  },

  async created() {
    try {
      this.loading = true;
      const data = await CertificationsService.getAll();
      const list = Array.isArray(data) ? data : data.results || [];
      this.declaracoes = list.map(item => ({
  id: item.id,
  nomeCompleto: item.nome_completo,
  curso: item.curso,
  cargaHoraria: item.carga_horaria,
  dataConclusao: item.data_conclusao,
  codigo: item.codigo,
  status: item.status,
  documento: item.documento,
  duracao: item.duracao,
  depoimento: item.declaracao || `Certificamos que o(a) ${item.nome_completo} concluiu com aproveitamento o curso de ${item.curso}, com carga horária de ${item.carga_horaria}, no período de ${item.duracao}.`,
  foto: item.foto || "https://via.placeholder.com/90",
  modulos: item.modulos || [],
  declaracao: item.declaracao || null
}));
    } catch (err) {
      this.error = "Erro ao carregar declarações.";
    } finally {
      this.loading = false;
    }
  },

  computed: {
    filteredDeclaracoes() {
      // Não mostrar nada antes do usuário pesquisar ou filtrar
      if (
        !this.searchQuery &&
        !this.selectedCourse &&
        !this.selectedYear &&
        !this.selectedStatus
      ) {
        return [];
      }

      let results = this.declaracoes;

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        results = results.filter(
          d =>
            d.nomeCompleto.toLowerCase().includes(q) ||
            d.curso.toLowerCase().includes(q) ||
            d.codigo.toLowerCase().includes(q)
        );
      }

      if (this.selectedCourse) {
        results = results.filter(d => d.curso === this.selectedCourse);
      }

      if (this.selectedYear) {
        results = results.filter(d =>
          d.dataConclusao.startsWith(this.selectedYear)
        );
      }

      if (this.selectedStatus) {
        results = results.filter(d => d.status === this.selectedStatus);
      }

      return results;
    },

    paginatedDeclaracoes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredDeclaracoes.slice(start, start + this.itemsPerPage);
    },

    totalPages() {
      return Math.ceil(this.filteredDeclaracoes.length / this.itemsPerPage);
    },

    visiblePages() {
      let pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    },

    cursos() {
      return [...new Set(this.declaracoes.map(d => d.curso))];
    }
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return "Data indisponível";
      return new Date(dateString).toLocaleDateString("pt-BR");
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    filterDeclaracoes() {
      // garante que a paginação volte pra primeira página ao filtrar
      this.currentPage = 1;
      // computed filteredDeclaracoes faz o resto
    },

    submitSearch() {
      // aciona a filtragem e mantém o comportamento de UX mínimo
      this.filterDeclaracoes();
    },

    clearSearch() {
      this.searchQuery = "";
      this.selectedCourse = "";
      this.selectedYear = "";
      this.selectedStatus = "";
    },

    viewDeclaracao(declaracao) {
    }
  }
};
</script>


<style scoped>
.search-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #3b4cb8, #2c3e50);
  color: white;
}
.search-section .section-title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.search-section .section-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  font-weight: 300;
}
.search-box {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
.search-main {
  margin-bottom: 2rem;
}
.search-input-group {
  position: relative;
}
.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 2;
}
.search-input {
  width: 100%;
  padding: 1rem 5.5rem 1rem 3rem; /* espaço maior à direita para o botão */
  font-size: 1.1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.9);
  color: #2c3e50;
  transition: all 0.3s ease;
}
.search-input:focus {
  outline: none;
  border-color: #ffc107;
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2);
  background: white;
}
.search-input::placeholder {
  color: #6c757d;
}
.clear-btn {
  position: absolute;
  right: 5.6rem; /* desloca para ficar à esquerda da seta */
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 5;
}
.clear-btn:hover {
  background: #c82333;
  transform: translateY(-50%) scale(1.1);
}
.search-submit {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #5b6bf0, #6f4df0);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 4;
  box-shadow: 0 6px 18px rgba(79, 70, 229, 0.25);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.search-submit i {
  font-size: 1.1rem;
}
.search-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.filter-group {
  display: flex;
  flex-direction: column;
}
.filter-group label {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}
.filter-group .form-select {
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  color: #2c3e50;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.filter-group .form-select:focus {
  outline: none;
  border-color: #ffc107;
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2);
  background: white;
}
.results-section {
  padding: 3rem 0;
  background: #f8f9fa;
}
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.results-header h1 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
}
.view-options {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.view-toggle {
  display: flex;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.view-btn {
  padding: 0.75rem 1rem;
  border: none;
  background: white;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.view-btn.active {
  background: linear-gradient(135deg, #3b4cb8, #4e73df);
  color: white;
}
.view-btn:hover:not(.active) {
  background: #f8f9fa;
  color: #3b4cb8;
}
.sort-options .form-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: white;
  color: #2c3e50;
  font-size: 0.9rem;
}
.declaracao-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.declaracao-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}
.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.declaracao-card:hover .card-image img {
  transform: scale(1.05);
}
.card-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
}
.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.student-name-card {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}
.course-name {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
  font-weight: 500;
}
.card-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.detail-row {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #495057;
}
.detail-row i {
  color: #3b4cb8;
  margin-right: 0.5rem;
  width: 16px;
}
.testimonial-preview {
  background: rgba(59, 76, 184, 0.05);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  flex: 1;
}
.testimonial-preview i {
  color: #3b4cb8;
  margin-bottom: 0.5rem;
}
.testimonial-preview p {
  font-size: 0.85rem;
  line-height: 1.4;
  color: #495057;
  margin: 0;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}
.certificate-code-small {
  font-size: 0.75rem;
  color: #6c757d;
  font-family: 'Courier New', monospace;
}
.btn-view-small {
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #3b4cb8, #4e73df);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-view-small:hover {
  transform: scale(1.1);
}
.declarations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.list-item {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border-left: 4px solid #3b4cb8;
}
.list-item:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
}
.list-photo {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}
.list-photo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.status-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 25px;
  height: 25px;
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  border: 2px solid white;
}
.list-content {
  flex: 1;
  display: flex;
  gap: 2rem;
  align-items: center;
}
.list-main {
  flex: 1;
}
.list-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}
.list-course {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}
.list-testimonial {
  font-size: 0.85rem;
  color: #495057;
  font-style: italic;
}
.list-testimonial i {
  color: #3b4cb8;
  margin-right: 0.5rem;
}
.list-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}
.list-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-detail-item .label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
}
.list-detail-item .value {
  font-size: 0.85rem;
  color: #2c3e50;
  font-weight: 600;
}
.list-action {
  margin-left: auto;
}
.btn-view-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b4cb8, #4e73df);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}
.btn-view-list:hover {
  background: linear-gradient(135deg, #2c3592, #3b5bd1);
  transform: scale(1.05);
}
.pagination-nav {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}
.pagination {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}
.page-item {
  border: none;
}
.page-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border: none;
  background: white;
  color: #495057;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}
.page-item.active .page-link {
  background: linear-gradient(135deg, #3b4cb8, #4e73df);
  color: white;
}
.page-link:hover:not(.page-item.disabled .page-link) {
  background: #f8f9fa;
  color: #3b4cb8;
}
.page-item.disabled .page-link {
  color: #dee2e6;
  cursor: not-allowed;
}
@media (max-width: 992px) {
  .list-content {
    flex-direction: column;
    gap: 1rem;
  }
  .list-details {
    flex-direction: row;
    min-width: auto;
    width: 100%;
    justify-content: space-between;
  }
}
@media (max-width: 768px) {
  .search-filters {
    grid-template-columns: 1fr;
  }
  .view-options {
    flex-direction: column;
    align-items: stretch;
  }
  .view-toggle {
    justify-content: center;
  }
  .list-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .list-photo {
    align-self: center;
  }
  .list-details {
    justify-content: space-around;
  }
  .list-action {
    margin-left: 0;
  }
  .btn-view-list {
    width: 100%;
    justify-content: center;
  }
}
@media (max-width: 576px) {
  .section-title {
    font-size: 1.8rem;
  }
  .search-box {
    padding: 1.5rem;
  }
  .search-input {
    padding: 0.75rem 4.8rem 0.75rem 3rem;
    font-size: 1rem;
  }
  .search-submit {
    width: 38px;
    height: 38px;
    right: 0.5rem;
  }
  .clear-btn {
    right: 4.8rem;
  }
  .pagination .page-link {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  .list-details {
    flex-direction: column;
    gap: 0.5rem;
  }
  .list-detail-item {
    justify-content: space-between;
  }
}
</style>