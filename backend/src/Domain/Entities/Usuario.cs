namespace QuizGamificado.Domain.Entities
{
    public class Usuario
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty; 
        
        public bool EmailConfirmado { get; set; } = false;
        public string? CodigoVerificacao { get; set; } 
        public DateTime? ValidadeCodigo { get; set; }
    }
}