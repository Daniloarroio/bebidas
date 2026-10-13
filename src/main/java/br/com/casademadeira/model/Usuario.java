package br.com.casademadeira.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "usuarios")
public class Usuario {
    @Id
    private String id;
    @Indexed(unique = true)
    private String email;
    private String nome;
    private String senha;
    private String perfil = "USER";

    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getNome() { return nome; }
    public String getSenha() { return senha; }
    public String getPerfil() { return perfil; }
    public void setId(String id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setNome(String nome) { this.nome = nome; }
    public void setSenha(String senha) { this.senha = senha; }
    public void setPerfil(String perfil) { this.perfil = perfil; }
}
