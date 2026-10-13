package br.com.casademadeira.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import br.com.casademadeira.model.Bebida;
import br.com.casademadeira.repository.BebidaRepository;

@RestController
@RequestMapping("/api/bebidas")
@Validated
public class BebidaController {
    private final BebidaRepository bebidas;

    public BebidaController(BebidaRepository bebidas) {
        this.bebidas = bebidas;
    }

    @GetMapping
    public List<Bebida> listar() {
        return bebidas.findAllByOrderByNomeAsc();
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody BebidaRequest request) {
        String nome = request.name().trim();
        if (bebidas.existsByNomeIgnoreCase(nome)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Já existe uma bebida com esse nome."));
        }

        Bebida bebida = new Bebida();
        bebida.setNome(nome);
        bebida.setIngredientes(request.ingredients().trim());
        bebida.setPreco(request.price().setScale(2, java.math.RoundingMode.HALF_UP));
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(bebidas.save(bebida));
        } catch (DuplicateKeyException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Já existe uma bebida com esse nome."));
        }
    }

    public record BebidaRequest(
            @NotBlank @Size(max = 80) String name,
            @NotBlank @Size(max = 250) String ingredients,
            @NotNull @DecimalMin("0.01") @Digits(integer = 8, fraction = 2) BigDecimal price) { }
}
