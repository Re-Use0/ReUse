// products-manager.js
class ProductsManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.currentProductId = null;
    }

    // Gerar ID único para cada produto
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Salvar produto
    saveProduct(productData, isEditing = false) {
        if (isEditing && this.currentProductId) {
            // Editar produto existente
            const index = this.products.findIndex(p => p.id === this.currentProductId);
            if (index !== -1) {
                this.products[index] = {...productData, id: this.currentProductId};
            }
        } else {
            // Adicionar novo produto
            const newProduct = {
                ...productData,
                id: this.generateId(),
                dateAdded: new Date().toISOString()
            };
            this.products.push(newProduct);
        }
        
        // Salvar no localStorage
        localStorage.setItem('products', JSON.stringify(this.products));
        return true;
    }

    // Obter produto por ID
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    // Obter todos os produtos
    getAllProducts() {
        return this.products;
    }

    // Remover produto
    removeProduct(id) {
        this.products = this.products.filter(product => product.id !== id);
        localStorage.setItem('products', JSON.stringify(this.products));
        return true;
    }

    // Definir produto atual para edição
    setCurrentProduct(id) {
        this.currentProductId = id;
    }

    // Limpar produto atual
    clearCurrentProduct() {
        this.currentProductId = null;
    }
}

// Instância global do gerenciador de produtos
const productsManager = new ProductsManager();