package com.timesphere.timesphere.dao;

import com.timesphere.timesphere.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class UserSearchDao {

    private final EntityManager em;

    public List<User> findAllBySimpleQuery(
            String email,
            String firstname,
            String lastname,
            String username
    ) {
        CriteriaBuilder criteriaBuilder = em.getCriteriaBuilder();
        CriteriaQuery<User> criteriaQuery = criteriaBuilder.createQuery(User.class);

        // select * from user
        // root <=> user
        Root<User> root = criteriaQuery.from(User.class);

        // prepare WHERE clause
        // WHERE firstname like '%admin%'
        Predicate firstnamePredicate = criteriaBuilder
                .like(root.get("firstname"), "%" + firstname + "%");
        Predicate lastnamePredicate = criteriaBuilder
                .like(root.get("lastname"), "%" + lastname + "%");
        Predicate emailPredicate = criteriaBuilder
                .like(root.get("email"), "%" + email + "%");
        Predicate usernamePredicate = criteriaBuilder
                .like(root.get("username"), "%" + username + "%");

        Predicate firstnameOrLastnamePredicate = criteriaBuilder.or(
                firstnamePredicate,
                lastnamePredicate
        );

        // final query -> select * from user where firstname like '%admin%'
        // or lastname like '%admin%' and email like '%email%'
        var andEmailPredicate = criteriaBuilder.and(firstnameOrLastnamePredicate, emailPredicate);
        criteriaQuery.where(andEmailPredicate);
        TypedQuery<User> query = em.createQuery(criteriaQuery);

        return query.getResultList();
    }

    public List<User> findAllByCriteria(SearchRequest request) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<User> cq = cb.createQuery(User.class);
        Root<User> root = cq.from(User.class);

        List<Predicate> predicates = new ArrayList<>();

        // 🔍 Keyword: gộp họ + tên + email
        if (request.getKeyword() != null && !request.getKeyword().isBlank()) {
            String kw = "%" + request.getKeyword().trim() + "%";
            predicates.add(cb.or(
                    cb.like(root.get("firstname"), kw),
                    cb.like(root.get("lastname"), kw),
                    cb.like(root.get("email"), kw)
            ));
        }

        // 🎭 Vai trò
        if (request.getRole() != null) {
            predicates.add(cb.equal(root.get("role"), request.getRole()));
        }

        // 📅 Ngày tạo (khoảng)
        if (request.getCreatedFrom() != null && request.getCreatedTo() != null) {
            try {
                LocalDate start = LocalDate.parse(request.getCreatedFrom());
                LocalDate end = LocalDate.parse(request.getCreatedTo());
                predicates.add(cb.between(root.get("createdAt"), start.atStartOfDay(), end.atTime(23, 59, 59)));
            } catch (DateTimeParseException ex) {
                // Tuỳ bạn xử lý ngoại lệ nhen
            }
        }

        cq.where(cb.and(predicates.toArray(new Predicate[0])));
        return em.createQuery(cq).getResultList();
    }
}
