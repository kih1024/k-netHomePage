<!--
	made by Yang Ji Yong
	made at 2017-07-30
	View Notice_List
-->

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="./Fun_Menu.css">
	<title>K-net 홈페이지 유머 게시판</title>
</head>
<body>
	<!-- 전체 div -->
	<div id="main_border_div_id">
		<!-- 실제 화면 div -->
		<div id="wrapper_div_id">
			<div id="top_div_id">
				<div class="top_div_class">
					top
				</div>
			</div>

			<!-- 중앙 div -->
			<div id="center_div_id">
				<!-- 중앙게시글 div -->
				<div class="center_div_class">
					<!-- 중앙게시글용 table div -->
					<div id="post_list_div_id">
						<form method="post" id="post_list_form_id">
							<table>
								<!-- table head -->
								<thead>
								<tr>
									<th>글번호</th>
									<th>제목</th>
									<th>작성자</th>
									<th>조회수</th>
									<th>작성일시</th>
								</tr>
								</thead>

								<!-- table end -->
								<tfoot>
									<tr> </tr>
								</tfoot>

								<!-- table body -->
								<!-- 이후 반복문을 통해 tr태그 생성 -->
								<tbody>
									<tr>
										<td>1</td>
										<td><span><a class="a_class" href="#">title1</span></a></td>
										<td>author1</td>
										<td>1</td>
										<td>2017-07-30</td>
									</tr>
									<tr>
										<td colspan="5" class="table_line_td_class">
											<img class="table_line_img_class" src="./table_line.png">
										</td>
									</tr>
									<tr>
										<td>2</td>
										<td><span><a class="a_class" href="#">title2</span></a></td>
										<td>author1</td>
										<td>10</td>
										<td>2017-07-30</td>
									</tr>
									<tr>
										<td colspan="5" class="table_line_td_class">
											<img class="table_line_img_class" src="./table_line.png"></td>
									</tr>
									<tr>
										<td>3</td>
										<td><span><a class="a_class" href="#">title3</span></a></td>
										<td>author2</td>
										<td>1</td>
										<td>2017-07-30</td>
									</tr>
								</tbody>
							</table>
						</form>
					</div>
				</div>

				<!-- 게시글 페이지 div -->
				<!-- 현재 선택한 a태그에 대해서만 색변환 해보기 -->
				<div class="page_list_div_class left180">
					<!-- toggleclass를 사용해서 페이지수에 따른 div의 왼쪽 margin수정 -->
					<table>
						<thead>
							<tr></tr>
						</thead>

						<tfoot>
							<tr></tr>
						</tfoot>

						<!-- 페이지수에 따라 td 동적 생성 -->
						<tbody>
							<tr>
								<td>
									<a class="a_class" id="page_list_a_prev_id" href="#">이전</a></td>
								<td>
									<a class="a_class" id="page_list_a_1_id" href="#">1</a></td>
								<td>
									<a class="a_class" id="page_list_a_2_id" href="#">2</a></td>
								<td>
									<a class="a_class" id="page_list_a_3_id" href="#">3</a></td>
								<td>
									<a class="a_class" id="page_list_a_4_id" href="#">4</a></td>
								<td>
									<a class="a_class" id="page_list_a_5_id" href="#">5</a></td>
								<td>
									<a class="a_class" id="page_list_a_next_id" href="#">다음</a></td>
							</tr>
						</tbody>

					</table>
				</div>

				<div id="postW_btn_div_id">
					<table>
						<tbody>
							<tr>
								<td>
									<span><a class="a_class" href="#">글쓰기</a></span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</body>
</html>