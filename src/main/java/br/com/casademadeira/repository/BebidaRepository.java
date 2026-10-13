package br.com.casademadeira.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import br.com.casademadeira.model.Bebida;

public interface BebidaRepository extends MongoRepository<Bebida, String> {
    List<Bebida> findAllByOrderByNomeAsc();
    boolean existsByNomeIgnoreCase(String nome);
}
