package com.footballstore.backend.modules.chatbot.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final List<String> FALLBACK_MODEL_URLS = List.of(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"
    );

    public String callGemini(String prompt) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.error("GEMINI_API_KEY has not been configured.");
            return "Chưa cấu hình GEMINI_API_KEY trên hệ thống Backend. Vui lòng thêm gemini.api.key trong file application.properties để Chatbot AI hoạt động.\nPRODUCTS:[]";
        }

        String aiResponse = executeGeminiRequest(apiUrl, prompt);
        if (aiResponse != null) {
            return aiResponse;
        }

        for (String fallbackUrl : FALLBACK_MODEL_URLS) {
            if (!fallbackUrl.equalsIgnoreCase(apiUrl)) {
                log.info("Trying Gemini fallback model URL: {}", fallbackUrl);
                aiResponse = executeGeminiRequest(fallbackUrl, prompt);
                if (aiResponse != null) {
                    return aiResponse;
                }
            }
        }

        return "Không thể kết nối tới Google Gemini API. Vui lòng kiểm tra lại API key hoặc hạn ngạch tại https://aistudio.google.com/apikey.\nPRODUCTS:[]";
    }

    public String extractReply(String rawResponse) {
        if (rawResponse == null) {
            return "";
        }
        return rawResponse.replaceAll("(?im)^\\s*PRODUCTS\\s*:\\s*\\[.*?\\]\\s*$", "").trim();
    }

    public List<Integer> extractProductIds(String rawResponse) {
        if (rawResponse == null) {
            return Collections.emptyList();
        }

        Pattern pattern = Pattern.compile("PRODUCTS\\s*:\\s*\\[(.*?)\\]", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
        Matcher matcher = pattern.matcher(rawResponse);
        if (!matcher.find()) {
            return Collections.emptyList();
        }

        String ids = matcher.group(1).trim();
        if (ids.isEmpty()) {
            return Collections.emptyList();
        }

        return Arrays.stream(ids.split(","))
                .map(String::trim)
                .filter(s -> s.matches("\\d+"))
                .map(Integer::parseInt)
                .distinct()
                .limit(3)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private String executeGeminiRequest(String targetUrl, String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", apiKey.trim());

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(targetUrl, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> resBody = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) resBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    if (content != null) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            return (String) parts.get(0).get("text");
                        }
                    }
                }
            }
        } catch (HttpStatusCodeException e) {
            log.error("Gemini API HTTP Error [{}]: {}", e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Gemini API connection error [{}]: {}", targetUrl, e.getMessage());
        }
        return null;
    }
}
