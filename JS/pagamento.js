        // Funcionalidade para o FAQ
        document.addEventListener('DOMContentLoaded', function() {
            const faqQuestions = document.querySelectorAll('.faq-question');
            
            faqQuestions.forEach(question => {
                question.addEventListener('click', function() {
                    // Toggle class active
                    this.classList.toggle('active');
                    
                    // Get the answer element
                    const answer = this.nextElementSibling;
                    
                    // Toggle max-height
                    if (answer.style.maxHeight) {
                        answer.style.maxHeight = null;
                    } else {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                });
            });
        });