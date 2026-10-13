package br.com.casademadeira.model;

import java.math.BigDecimal;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bebidas")
public class Bebida {
    @Id
    private String id;
    @Indexed(unique = true)
    private String nome;
    private String ingredientes;
    private BigDecimal preco;

    public String getId() { return id; }
    public String getNome() { return nome; }
    public String getIngredientes() { return ingredientes; }
    public BigDecimal getPreco() { return preco; }
    public void setId(String id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setIngredientes(String ingredientes) { this.ingredientes = ingredientes; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }
}
