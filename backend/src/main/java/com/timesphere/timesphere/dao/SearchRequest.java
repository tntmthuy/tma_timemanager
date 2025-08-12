package com.timesphere.timesphere.dao;

import com.timesphere.timesphere.entity.type.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchRequest {
    private String keyword;
    private Role role;
    private String createdFrom; // yyyy-MM-dd
    private String createdTo;   // yyyy-MM-dd
}
